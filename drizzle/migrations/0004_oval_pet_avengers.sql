CREATE TABLE `reports` (
	`id` varchar(20) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`definition_id` varchar(20) NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`reason` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `definitions` MODIFY COLUMN `id` varchar(20) NOT NULL;