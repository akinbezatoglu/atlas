import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppBindings } from "../types";

const memberRoutes = new Hono<AppBindings>()
  .get(
    "/",
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const userId = c.var.userId;
      const { workspaceId } = c.req.valid("query");
      const { members: memberService, users: userService } = c.var.services;

      const member = await memberService.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const workspaceMembers =
        await memberService.findByWorkspaceId(workspaceId);

      const populatedMembers = await Promise.all(
        workspaceMembers.map(async (m) => {
          const user = await userService.findById(m.userId);
          return {
            ...m,
            name: user?.name ?? "Unknown",
            email: user?.email ?? "",
          };
        }),
      );

      return c.json({
        data: {
          documents: populatedMembers,
          total: populatedMembers.length,
        },
      });
    },
  )
  .delete("/:memberId", async (c) => {
    const userId = c.var.userId;
    const { memberId } = c.req.param();
    const { members: memberService } = c.var.services;

    const allMembers = await memberService.findByUserId(userId);
    const memberToDelete = allMembers.find((m) => m.id === memberId);

    if (!memberToDelete) {
      const workspaceMembers = await memberService.findByWorkspaceId(
        (
          await memberService.findByUserId(userId)
        )[0]?.workspaceId ?? "",
      );
      // Try direct lookup through workspace
      const db = c.var.services;
    }

    // Find the member to delete by looking up directly
    const { users } = c.var.services;
    // We need to find the member record and check permissions
    // Let's get all members for the user's workspaces
    const userMemberships = await memberService.findByUserId(userId);

    // Find which workspace the target member belongs to
    // We need to check each workspace
    for (const membership of userMemberships) {
      const wsMembers = await memberService.findByWorkspaceId(
        membership.workspaceId,
      );
      const target = wsMembers.find((m) => m.id === memberId);

      if (target) {
        // Found the target member
        const currentUserMember = wsMembers.find((m) => m.userId === userId);

        if (!currentUserMember) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        if (
          currentUserMember.id !== memberId &&
          currentUserMember.role !== "ADMIN"
        ) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        if (wsMembers.length === 1) {
          return c.json({ error: "Cannot delete the only member" }, 400);
        }

        await memberService.delete(memberId);
        return c.json({ data: { id: memberId } });
      }
    }

    return c.json({ error: "Member not found" }, 404);
  })
  .patch(
    "/:memberId",
    zValidator("json", z.object({ role: z.enum(["ADMIN", "MEMBER"]) })),
    async (c) => {
      const userId = c.var.userId;
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const { members: memberService } = c.var.services;

      const userMemberships = await memberService.findByUserId(userId);

      for (const membership of userMemberships) {
        const wsMembers = await memberService.findByWorkspaceId(
          membership.workspaceId,
        );
        const target = wsMembers.find((m) => m.id === memberId);

        if (target) {
          const currentUserMember = wsMembers.find((m) => m.userId === userId);

          if (!currentUserMember || currentUserMember.role !== "ADMIN") {
            return c.json({ error: "Unauthorized" }, 401);
          }

          if (wsMembers.length === 1) {
            return c.json(
              { error: "Cannot downgrade the only member" },
              400,
            );
          }

          await memberService.updateRole(memberId, role);
          return c.json({ data: { id: memberId } });
        }
      }

      return c.json({ error: "Member not found" }, 404);
    },
  );

export default memberRoutes;
