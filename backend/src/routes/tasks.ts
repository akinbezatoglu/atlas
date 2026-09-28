import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, and, asc, desc, like, sql } from "drizzle-orm";
import type { AppBindings } from "../types";
import {
  createTaskSchema,
  bulkUpdateTasksSchema,
  TaskStatusEnum,
} from "../lib/schemas";
import { generateId } from "../lib/crypto";
import { tasks, projects, members, users } from "../db/schema";
import { createDb } from "../db";

const taskRoutes = new Hono<AppBindings>()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: TaskStatusEnum.nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      }),
    ),
    async (c) => {
      const userId = c.var.userId;
      const { workspaceId, projectId, status, search, assigneeId, dueDate } =
        c.req.valid("query");
      const { members: memberService } = c.var.services;

      const member = await memberService.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const db = createDb(c.env.DB);
      const conditions = [eq(tasks.workspaceId, workspaceId)];

      if (projectId) conditions.push(eq(tasks.projectId, projectId));
      if (status) conditions.push(eq(tasks.status, status));
      if (assigneeId) conditions.push(eq(tasks.assigneeId, assigneeId));
      if (dueDate) conditions.push(eq(tasks.dueDate, dueDate));
      if (search) conditions.push(like(tasks.name, `%${search}%`));

      const taskList = await db
        .select()
        .from(tasks)
        .where(and(...conditions))
        .orderBy(desc(tasks.createdAt))
        .all();

      // Populate projects and assignees
      const projectIds = [...new Set(taskList.map((t) => t.projectId))];
      const assigneeIds = [...new Set(taskList.map((t) => t.assigneeId))];

      const [projectList, memberList] = await Promise.all([
        projectIds.length > 0
          ? db
              .select()
              .from(projects)
              .where(
                sql`${projects.id} IN (${sql.join(
                  projectIds.map((id) => sql`${id}`),
                  sql`, `,
                )})`,
              )
              .all()
          : [],
        assigneeIds.length > 0
          ? db
              .select()
              .from(users)
              .where(
                sql`${users.id} IN (${sql.join(
                  assigneeIds.map((id) => sql`${id}`),
                  sql`, `,
                )})`,
              )
              .all()
          : [],
      ]);

      const populatedTasks = taskList.map((task) => {
        const project = projectList.find((p) => p.id === task.projectId);
        const assignee = memberList.find((u) => u.id === task.assigneeId);

        return {
          ...task,
          project: project
            ? { id: project.id, name: project.name, imageUrl: project.imageUrl }
            : undefined,
          assignee: assignee
            ? { id: assignee.id, name: assignee.name, email: assignee.email }
            : undefined,
        };
      });

      return c.json({
        data: {
          documents: populatedTasks,
          total: populatedTasks.length,
        },
      });
    },
  )
  .get("/:taskId", async (c) => {
    const userId = c.var.userId;
    const { taskId } = c.req.param();
    const { members: memberService, tasks: taskService, projects: projectService, users: userService } =
      c.var.services;

    const task = await taskService.findById(taskId);
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const member = await memberService.findByWorkspaceAndUser(
      task.workspaceId,
      userId,
    );
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await projectService.findById(task.projectId);
    const assignee = await userService.findById(task.assigneeId);

    return c.json({
      data: {
        ...task,
        project: project
          ? { id: project.id, name: project.name, imageUrl: project.imageUrl }
          : undefined,
        assignee: assignee
          ? { id: assignee.id, name: assignee.name, email: assignee.email }
          : undefined,
      },
    });
  })
  .post("/", zValidator("json", createTaskSchema), async (c) => {
    const userId = c.var.userId;
    const { name, status, workspaceId, projectId, dueDate, assigneeId, description } =
      c.req.valid("json");
    const { members: memberService, tasks: taskService } = c.var.services;

    const member = await memberService.findByWorkspaceAndUser(
      workspaceId,
      userId,
    );
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Find highest position
    const db = createDb(c.env.DB);
    const highestTask = await db
      .select({ position: tasks.position })
      .from(tasks)
      .where(
        and(eq(tasks.status, status), eq(tasks.workspaceId, workspaceId)),
      )
      .orderBy(asc(tasks.position))
      .limit(1)
      .get();

    const newPosition = highestTask ? highestTask.position + 1000 : 1000;

    const task = await taskService.create({
      id: generateId(),
      name,
      status,
      workspaceId,
      projectId,
      dueDate,
      assigneeId,
      description: description ?? null,
      position: newPosition,
    });

    return c.json({ data: task });
  })
  .patch(
    "/:taskId",
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const userId = c.var.userId;
      const { taskId } = c.req.param();
      const updates = c.req.valid("json");
      const { members: memberService, tasks: taskService } = c.var.services;

      const existing = await taskService.findById(taskId);
      if (!existing) {
        return c.json({ error: "Task not found" }, 404);
      }

      const member = await memberService.findByWorkspaceAndUser(
        existing.workspaceId,
        userId,
      );
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await taskService.update(taskId, updates);
      return c.json({ data: task });
    },
  )
  .delete("/:taskId", async (c) => {
    const userId = c.var.userId;
    const { taskId } = c.req.param();
    const { members: memberService, tasks: taskService } = c.var.services;

    const task = await taskService.findById(taskId);
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const member = await memberService.findByWorkspaceAndUser(
      task.workspaceId,
      userId,
    );
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await taskService.delete(taskId);
    return c.json({ data: { id: taskId } });
  })
  .post(
    "/bulk-update",
    zValidator("json", bulkUpdateTasksSchema),
    async (c) => {
      const userId = c.var.userId;
      const { tasks: taskUpdates } = c.req.valid("json");
      const { members: memberService, tasks: taskService } = c.var.services;

      // Verify all tasks exist and belong to same workspace
      const existingTasks = await Promise.all(
        taskUpdates.map((t) => taskService.findById(t.id)),
      );

      const workspaceIds = new Set(
        existingTasks
          .filter((t): t is NonNullable<typeof t> => t !== undefined)
          .map((t) => t.workspaceId),
      );

      if (workspaceIds.size !== 1) {
        return c.json(
          { error: "All tasks must belong to the same workspace" },
          400,
        );
      }

      const workspaceId = [...workspaceIds][0];
      const member = await memberService.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        taskUpdates.map((t) =>
          taskService.update(t.id, { status: t.status, position: t.position }),
        ),
      );

      return c.json({ data: updatedTasks });
    },
  );

export default taskRoutes;
