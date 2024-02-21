DROP TABLE `magic_tokens`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_google_id_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `role` enum('user','moderator') DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `github_id` int unsigned;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_github_id_unique` UNIQUE(`github_id`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `image`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `google_id`;