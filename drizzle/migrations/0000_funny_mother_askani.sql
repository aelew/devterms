CREATE TABLE `definitions` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`status` enum('pending','approved','denied') NOT NULL DEFAULT 'pending',
	`term` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`example` text NOT NULL,
	`upvotes` int unsigned NOT NULL DEFAULT 0,
	`downvotes` int unsigned NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `definitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `magic_tokens` (
	`id` varchar(20) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `magic_tokens_id` PRIMARY KEY(`id`)
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
	`image` varchar(255),
	`google_id` varchar(21),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_google_id_unique` UNIQUE(`google_id`)
);
