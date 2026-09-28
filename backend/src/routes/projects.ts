import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, and, gte, lte, ne, lt, sql } from "drizzle-orm";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import type { AppBindings } from "../types";
import { createProjectSchema, updateProjectSchema } from "../lib/schemas";
import { generateId } from "../lib/crypto";
import { tasks } from "../db/schema";
import { createDb } from "../db";

const projectRoutes = new Hono<AppBindings>()
  .get(
    "/",
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const userId = c.var.userId;
      const { workspaceId } = c.req.valid("query");
      const { members: memberService, projects: projectService } =
        c.var.services;

      const member = await memberService.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projectList = await projectService.findByWorkspaceId(workspaceId);
      return c.json({ data: { projects: projectList } });
    },
  )
  .get("/:projectId", async (c) => {
    const userId = c.var.userId;
    const { projectId } = c.req.param();
    const { members: memberService, projects: projectService } =
      c.var.services;

    const project = await projectService.findById(projectId);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const member = await memberService.findByWorkspaceAndUser(
      project.workspaceId,
      userId,
    );
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: { project } });
  })
  .get("/:projectId/analytics", async (c) => {
    const userId = c.var.userId;
    const { projectId } = c.req.param();
    const { members: memberService, projects: projectService } =
      c.var.services;

    const project = await projectService.findById(projectId);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const member = await memberService.findByWorkspaceAndUser(
      project.workspaceId,
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
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
            eq(tasks.projectId, projectId),
            ne(tasks.status, "DONE"),
            lt(tasks.dueDate, now.toISOString()),
            gte(tasks.createdAt, lastMonthStart),
            lte(tasks.createdAt, lastMonthEnd),
          ),
        )
        .get(),
    ]);

    return c.json({
      data: {
        taskCount: thisMonthTasks?.count ?? 0,
        taskDifference:
          (thisMonthTasks?.count ?? 0) - (lastMonthTasks?.count ?? 0),
        assignedTaskCount: thisMonthAssigned?.count ?? 0,
        assignedTaskDifference:
          (thisMonthAssigned?.count ?? 0) - (lastMonthAssigned?.count ?? 0),
        completedTaskCount: thisMonthComplete?.count ?? 0,
        completedTaskDifference:
          (thisMonthComplete?.count ?? 0) - (lastMonthComplete?.count ?? 0),
        incompletedTaskCount: thisMonthIncomplete?.count ?? 0,
        incompletedTaskDifference:
          (thisMonthIncomplete?.count ?? 0) -
          (lastMonthIncomplete?.count ?? 0),
        overDueTaskCount: thisMonthOverdue?.count ?? 0,
        overDueTaskDifference:
          (thisMonthOverdue?.count ?? 0) - (lastMonthOverdue?.count ?? 0),
      },
    });
  })
  .post("/", zValidator("json", createProjectSchema), async (c) => {
    const userId = c.var.userId;
    const { name, imageUrl, workspaceId } = c.req.valid("json");
    const { members: memberService, projects: projectService } =
      c.var.services;

    const member = await memberService.findByWorkspaceAndUser(
      workspaceId,
      userId,
    );
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await projectService.create({
      id: generateId(),
      name,
      imageUrl: imageUrl ?? null,
      workspaceId,
    });

    return c.json({ data: project });
  })
  .patch(
    "/:projectId",
    zValidator("json", updateProjectSchema),
    async (c) => {
      const userId = c.var.userId;
      const { projectId } = c.req.param();
      const { name, imageUrl } = c.req.valid("json");
      const { members: memberService, projects: projectService } =
        c.var.services;

      const existing = await projectService.findById(projectId);
      if (!existing) {
        return c.json({ error: "Project not found" }, 404);
      }

      const member = await memberService.findByWorkspaceAndUser(
        existing.workspaceId,
        userId,
      );
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const project = await projectService.update(projectId, {
        ...(name !== undefined && { name }),
        ...(imageUrl !== undefined && { imageUrl }),
      });

      return c.json({ data: project });
    },
  )
  .delete("/:projectId", async (c) => {
    const userId = c.var.userId;
    const { projectId } = c.req.param();
    const { members: memberService, projects: projectService } =
      c.var.services;

    const existing = await projectService.findById(projectId);
    if (!existing) {
      return c.json({ error: "Project not found" }, 404);
    }

    const member = await memberService.findByWorkspaceAndUser(
      existing.workspaceId,
      userId,
    );
    if (!member || member.role !== "ADMIN") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await projectService.delete(projectId);
    return c.json({ data: { id: projectId } });
  });

export default projectRoutes;
