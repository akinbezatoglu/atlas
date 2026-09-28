import {
  integer,
  sqliteTable,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql, defineRelations } from "drizzle-orm";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("idx_users_email").on(table.email)],
);

export const workspaces = sqliteTable(
  "workspaces",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    inviteCode: text("invite_code").notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    enableForVisitors: integer("enable_for_visitors", { mode: "boolean" })
      .default(false)
      .notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("idx_workspaces_user_id").on(table.userId),
    uniqueIndex("idx_workspaces_invite_code").on(table.inviteCode),
  ],
);

export const members = sqliteTable(
  "members",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role", { enum: ["ADMIN", "MEMBER"] })
      .default("MEMBER")
      .notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("idx_members_workspace_id").on(table.workspaceId),
    index("idx_members_user_id").on(table.userId),
    uniqueIndex("idx_members_workspace_user").on(
      table.workspaceId,
      table.userId,
    ),
  ],
);

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    workspaceId: text("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("idx_projects_workspace_id").on(table.workspaceId)],
);

export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    status: text("status", {
      enum: ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
    })
      .default("TODO")
      .notNull(),
    position: integer("position").notNull(),
    dueDate: text("due_date").notNull(),
    description: text("description"),
    workspaceId: text("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    projectId: text("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    assigneeId: text("assignee_id")
      .references(() => users.id)
      .notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("idx_tasks_workspace_id").on(table.workspaceId),
    index("idx_tasks_project_id").on(table.projectId),
    index("idx_tasks_assignee_id").on(table.assigneeId),
    index("idx_tasks_workspace_status").on(table.workspaceId, table.status),
    index("idx_tasks_project_position").on(table.projectId, table.position),
  ],
);

export const schemaRelations = defineRelations(
  {
    users,
    workspaces,
    members,
    projects,
    tasks,
  },
  (r) => ({
    users: {
      workspaces: r.many.workspaces(),
      members: r.many.members(),
      tasks: r.many.tasks(),
    },
    workspaces: {
      owner: r.one.users({
        from: r.workspaces.userId,
        to: r.users.id,
      }),
      members: r.many.members(),
      projects: r.many.projects(),
      tasks: r.many.tasks(),
    },
    members: {
      workspace: r.one.workspaces({
        from: r.members.workspaceId,
        to: r.workspaces.id,
      }),
      user: r.one.users({
        from: r.members.userId,
        to: r.users.id,
      }),
    },
    projects: {
      workspace: r.one.workspaces({
        from: r.projects.workspaceId,
        to: r.workspaces.id,
      }),
      tasks: r.many.tasks(),
    },
    tasks: {
      workspace: r.one.workspaces({
        from: r.tasks.workspaceId,
        to: r.workspaces.id,
      }),
      project: r.one.projects({
        from: r.tasks.projectId,
        to: r.projects.id,
      }),
      assignee: r.one.users({
        from: r.tasks.assigneeId,
        to: r.users.id,
      }),
    },
  }),
);

export type User = typeof users.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type NewMember = typeof members.$inferInsert;
export type NewProject = typeof projects.$inferInsert;
export type NewTask = typeof tasks.$inferInsert;
