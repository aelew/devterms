-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `definitions` (
	`id` varchar(20) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`term` varchar(255) NOT NULL,
	`definition` text NOT NULL,
	`example` text NOT NULL,
	`upvotes` int unsigned NOT NULL DEFAULT 0,
	`downvotes` int unsigned NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `definitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` varchar(20) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`definition_id` varchar(20) NOT NULL,
	`read` tinyint NOT NULL DEFAULT 0,
	`reason` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(21) NOT NULL,
	`name` varchar(32),
	`email` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`role` enum('user','bot','moderator','owner') NOT NULL DEFAULT 'user',
	`avatar` varchar(255) NOT NULL,
	`github_id` int unsigned NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_github_id_unique` UNIQUE(`github_id`)
);
--> statement-breakpoint
CREATE TABLE `wotds` (
	`id` varchar(21) NOT NULL,
	`definition_id` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `wotds_id` PRIMARY KEY(`id`)
);

*/