ALTER TABLE `definitions` MODIFY COLUMN `upvotes` int unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `definitions` MODIFY COLUMN `upvotes` int unsigned NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `definitions` MODIFY COLUMN `downvotes` int unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `definitions` MODIFY COLUMN `downvotes` int unsigned NOT NULL DEFAULT 0;