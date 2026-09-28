import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().email(),
  password: z.string().min(8, "Minimum of 8 characters required"),
});

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  imageUrl: z.string().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  imageUrl: z.string().optional(),
  enableForVisitors: z.boolean().optional(),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  imageUrl: z.string().optional(),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  imageUrl: z.string().optional(),
});

export const TaskStatusEnum = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
]);

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: TaskStatusEnum,
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.string().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
});

export const bulkUpdateTasksSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string(),
      status: TaskStatusEnum,
      position: z.number().int().positive().min(1_000).max(1_000_000),
    }),
  ),
});
