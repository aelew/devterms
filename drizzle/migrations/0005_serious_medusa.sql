CREATE TABLE `wotds` (
	`id` varchar(21) NOT NULL,
	`definition_id` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `wotds_id` PRIMARY KEY(`id`)
);
