import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { eq, and, gte, lte, ne, lt, sql } from "drizzle-orm";
import type { AppBindings } from "../types";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../lib/schemas";
import { generateId, generateInviteCode } from "../lib/crypto";
import { tasks, members, workspaces } from "../db/schema";
import { z } from "zod";
import { createDb } from "../db";

const workspaceRoutes = new Hono<AppBindings>()
  .get("/", async (c) => {
    const userId = c.var.userId;
    const { members: memberService, workspaces: wsService } = c.var.services;

    const userMembers = await memberService.findByUserId(userId);

    if (userMembers.length === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = userMembers.map((m) => m.workspaceId);
    const db = createDb(c.env.DB);

    const userWorkspaces = await db
      .select()
      .from(workspaces)
      .where(
        sql`${workspaces.id} IN (${sql.join(
          workspaceIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      )
      .all();

    return c.json({
      data: { documents: userWorkspaces, total: userWorkspaces.length },
    });
  })
  .get("/:workspaceId", async (c) => {
    const userId = c.var.userId;
    const { workspaceId } = c.req.param();
    const { members: memberService, workspaces: wsService } = c.var.services;

    const member = await memberService.findByWorkspaceAndUser(
      workspaceId,
      userId,
    );
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await wsService.findById(workspaceId);
    if (!workspace) {
      return c.json({ error: "Workspace not found" }, 404);
    }

    return c.json({ data: workspace });
  })
  .get("/:workspaceId/info", async (c) => {
    const { workspaceId } = c.req.param();
    const { workspaces: wsService } = c.var.services;

    const workspace = await wsService.findById(workspaceId);
    if (!workspace) {
      return c.json({ error: "Workspace not found" }, 404);
    }

    return c.json({
      data: {
        id: workspace.id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })
  .get("/:workspaceId/analytics", async (c) => {
    const userId = c.var.userId;
    const { workspaceId } = c.req.param();
    const { members: memberService } = c.var.services;

    const member = await memberService.findByWorkspaceAndUser(
      workspaceId,
      userId,
    );
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = createDb(c.env.DB);
    const now = new Date();
    const thisMonthStart = startOfMonth(now).toISOString();
    const thisMonthEnd = endOfMonth(now).toISOString();
    const lastMonthStart = startOfMonth(subMonths(now, 1)).toISOString();
    const lastMonthEnd = endOfMonth(subMonths(now, 1)).toISOString();

    const [
      thisMonthTasks,
      lastMonthTasks,
      thisMonthAssigned,
      lastMonthAssigned,
      thisMonthIncomplete,
      lastMonthIncomplete,
      thisMonthComplete,
      lastMonthComplete,
      thisMonthOverdue,
      lastMonthOverdue,
    ] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            eq(tasks.assigneeId, userId),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            eq(tasks.assigneeId, userId),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            ne(tasks.status, "DONE"),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            ne(tasks.status, "DONE"),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            eq(tasks.status, "DONE"),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            eq(tasks.status, "DONE"),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            ne(tasks.status, "DONE"),
            lt(tasks.dueDate, now.toISOString()),
            gte(tasks.createdAt, thisMonthStart),
            lte(tasks.createdAt, thisMonthEnd),
          ),
        )
        .get(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, workspaceId),
            ne(tasks.status, "DONE"),
            lt(tasks.dueDate, now.toISOString()),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd),
          ),
        )
        .get(),
    ]);

    const taskCount = thisMonthTasks?.count ?? 0;
    const taskDifference = taskCount - (lastMonthTasks?.count ?? 0);
    const assignedTaskCount = thisMonthAssigned?.count ?? 0;
    const assignedTaskDifference =
      assignedTaskCount - (lastMonthAssigned?.count ?? 0);
    const incompletedTaskCount = thisMonthIncomplete?.count ?? 0;
    const incompletedTaskDifference =
      incompletedTaskCount - (lastMonthIncomplete?.count ?? 0);
    const completedTaskCount = thisMonthComplete?.count ?? 0;
    const completedTaskDifference =
      completedTaskCount - (lastMonthComplete?.count ?? 0);
    const overDueTaskCount = thisMonthOverdue?.count ?? 0;
    const overDueTaskDifference =
      overDueTaskCount - (lastMonthOverdue?.count ?? 0);

    return c.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        incompletedTaskCount,
        incompletedTaskDifference,
        overDueTaskCount,
        overDueTaskDifference,
      },
    });
  })
  .post("/", zValidator("json", createWorkspaceSchema), async (c) => {
    const userId = c.var.userId;
    const { name, imageUrl } = c.req.valid("json");
    const { workspaces: wsService, members: memberService } = c.var.services;

    const workspace = await wsService.create({
      id: generateId(),
      name,
      imageUrl: imageUrl ?? null,
      inviteCode: generateInviteCode(12),
      userId,
    });

    await memberService.create({
      id: generateId(),
      workspaceId: workspace.id,
      userId,
      role: "ADMIN",
    });

    return c.json({ data: workspace });
  })
  .patch(
    "/:workspaceId",
    zValidator("json", updateWorkspaceSchema),
    async (c) => {
      const userId = c.var.userId;
      const { workspaceId } = c.req.param();
      const { name, imageUrl, enableForVisitors } = c.req.valid("json");
      const { members: memberService, workspaces: wsService } = c.var.services;

      const member = await memberService.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );
      if (!member || member.role !== "ADMIN") {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const workspace = await wsService.update(workspaceId, {
        ...(name !== undefined && { name }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(enableForVisitors !== undefined && { enableForVisitors }),
      });

      return c.json({ data: workspace });
    },
  )
  .delete("/:workspaceId", async (c) => {
    const userId = c.var.userId;
    const { workspaceId } = c.req.param();
    const { members: memberService, workspaces: wsService } = c.var.services;

    const member = await memberService.findByWorkspaceAndUser(
      workspaceId,
      userId,
    );
    if (!member || member.role !== "ADMIN") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await wsService.delete(workspaceId);

    return c.json({ data: { id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", async (c) => {
    const userId = c.var.userId;
    const { workspaceId } = c.req.param();
    const { members: memberService, workspaces: wsService } = c.var.services;

    const member = await memberService.findByWorkspaceAndUser(
      workspaceId,
      userId,
    );
    if (!member || member.role !== "ADMIN") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await wsService.update(workspaceId, {
      inviteCode: generateInviteCode(10),
    });

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const userId = c.var.userId;
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");
      const { members: memberService, workspaces: wsService } = c.var.services;

      const existingMember = await memberService.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );
      if (existingMember) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace = await wsService.findById(workspaceId);
      if (!workspace) {
        return c.json({ error: "Workspace not found" }, 404);
      }

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await memberService.create({
        id: generateId(),
        workspaceId,
        userId,
        role: "MEMBER",
      });

      return c.json({ data: workspace });
    },
  );

export default workspaceRoutes;
