CREATE TABLE `definitions` (
	`id` text(20) PRIMARY KEY NOT NULL,
	`user_id` text(21) NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`term` text(255) NOT NULL,
	`definition` text NOT NULL,
	`example` text NOT NULL,
	`upvotes` integer DEFAULT 0 NOT NULL,
	`downvotes` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text(20) PRIMARY KEY NOT NULL,
	`user_id` text(21) NOT NULL,
	`definition_id` text(20) NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`reason` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(21) NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(21) PRIMARY KEY NOT NULL,
	`name` text(32),
	`role` text DEFAULT 'user' NOT NULL,
	`email` text(255) NOT NULL,
	`avatar` text(255) NOT NULL,
	`github_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wotds` (
	`id` text(21) PRIMARY KEY NOT NULL,
	`definition_id` text(20) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `definitions_status_idx` ON `definitions` (`status`);--> statement-breakpoint
CREATE INDEX `definitions_term_idx` ON `definitions` (`term`);--> statement-breakpoint
CREATE INDEX `definitions_upvotes_idx` ON `definitions` (`upvotes`);--> statement-breakpoint
CREATE INDEX `definitions_created_at_idx` ON `definitions` (`created_at`);--> statement-breakpoint
CREATE INDEX `reports_read_idx` ON `reports` (`read`);--> statement-breakpoint
CREATE INDEX `reports_created_at_idx` ON `reports` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);--> statement-breakpoint
CREATE INDEX `users_name_idx` ON `users` (`name`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `wotds_created_at_idx` ON `wotds` (`created_at`);