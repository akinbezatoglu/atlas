CREATE TABLE `members` (
	`id` text PRIMARY KEY,
	`workspace_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'MEMBER' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT `fk_members_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`image_url` text,
	`workspace_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT `fk_projects_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`status` text DEFAULT 'TODO' NOT NULL,
	`position` integer NOT NULL,
	`due_date` text NOT NULL,
	`description` text,
	`workspace_id` text NOT NULL,
	`project_id` text NOT NULL,
	`assignee_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT `fk_tasks_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_tasks_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_tasks_assignee_id_users_id_fk` FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`image_url` text,
	`invite_code` text NOT NULL,
	`user_id` text NOT NULL,
	`enable_for_visitors` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT `fk_workspaces_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `idx_members_workspace_id` ON `members` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_members_user_id` ON `members` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_members_workspace_user` ON `members` (`workspace_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `idx_projects_workspace_id` ON `projects` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_tasks_workspace_id` ON `tasks` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `idx_tasks_project_id` ON `tasks` (`project_id`);--> statement-breakpoint
CREATE INDEX `idx_tasks_assignee_id` ON `tasks` (`assignee_id`);--> statement-breakpoint
CREATE INDEX `idx_tasks_workspace_status` ON `tasks` (`workspace_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_tasks_project_position` ON `tasks` (`project_id`,`position`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_workspaces_user_id` ON `workspaces` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_workspaces_invite_code` ON `workspaces` (`invite_code`);