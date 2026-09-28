export type User = {
  id: string;
  name?: string | null;
  email: string;
};

export type Workspace = {
  id: string;
  name?: string | null;
  imageUrl: string | null;
  inviteCode: string;
  userId: string;
  enableForVisitors: boolean;
  createdAt: string;
};

export type Member = {
  id: string;
  workspaceId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  createdAt: string;
  name?: string;
  email?: string;
};

export type Project = {
  id: string;
  name?: string | null;
  imageUrl: string | null;
  workspaceId: string;
  createdAt: string;
};

export const TaskStatus = {
  BACKLOG: "BACKLOG",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export type Task = {
  id: string;
  name?: string | null;
  status: TaskStatus;
  position: number;
  dueDate: string;
  description: string | null;
  workspaceId: string;
  projectId: string;
  assigneeId: string;
  createdAt: string;
  project?: { id: string; name?: string | null; imageUrl: string | null };
  assignee?: { id: string; name?: string | null; email: string };
};

export type Analytics = {
  taskCount: number;
  taskDifference: number;
  assignedTaskCount: number;
  assignedTaskDifference: number;
  completedTaskCount: number;
  completedTaskDifference: number;
  incompletedTaskCount: number;
  incompletedTaskDifference: number;
  overDueTaskCount: number;
  overDueTaskDifference: number;
};

export type PaginatedResponse<T> = {
  documents: T[];
  total: number;
};
