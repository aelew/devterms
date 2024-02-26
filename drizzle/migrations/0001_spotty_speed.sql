ALTER TABLE `reports` MODIFY COLUMN `read` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `reports` MODIFY COLUMN `read` boolean NOT NULL DEFAULT false;--> statement-breakpoint
CREATE INDEX `status_idx` ON `definitions` (`status`);--> statement-breakpoint
CREATE INDEX `term_idx` ON `definitions` (`term`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `definitions` (`created_at`);--> statement-breakpoint
CREATE INDEX `read_idx` ON `reports` (`read`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `reports` (`created_at`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `users` (`name`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `wotds` (`created_at`);