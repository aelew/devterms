import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, varchar, mysqlEnum, text, timestamp, tinyint, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const definitions = mysqlTable("definitions", {
	id: varchar("id", { length: 20 }).notNull(),
	userId: varchar("user_id", { length: 21 }).notNull(),
	status: mysqlEnum("status", ['pending','approved','rejected']).default('pending').notNull(),
	term: varchar("term", { length: 255 }).notNull(),
	definition: text("definition").notNull(),
	example: text("example").notNull(),
	upvotes: int("upvotes", { unsigned: true }).default(0).notNull(),
	downvotes: int("downvotes", { unsigned: true }).default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		definitionsId: primaryKey({ columns: [table.id], name: "definitions_id"}),
	}
});

export const reports = mysqlTable("reports", {
	id: varchar("id", { length: 20 }).notNull(),
	userId: varchar("user_id", { length: 21 }).notNull(),
	definitionId: varchar("definition_id", { length: 20 }).notNull(),
	read: tinyint("read").default(0).notNull(),
	reason: text("reason").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		reportsId: primaryKey({ columns: [table.id], name: "reports_id"}),
	}
});

export const sessions = mysqlTable("sessions", {
	id: varchar("id", { length: 255 }).notNull(),
	userId: varchar("user_id", { length: 21 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		sessionsId: primaryKey({ columns: [table.id], name: "sessions_id"}),
	}
});

export const users = mysqlTable("users", {
	id: varchar("id", { length: 21 }).notNull(),
	name: varchar("name", { length: 32 }),
	email: varchar("email", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	role: mysqlEnum("role", ['user','bot','moderator','owner']).default('user').notNull(),
	avatar: varchar("avatar", { length: 255 }).notNull(),
	githubId: int("github_id", { unsigned: true }).notNull(),
},
(table) => {
	return {
		usersId: primaryKey({ columns: [table.id], name: "users_id"}),
		usersEmailUnique: unique("users_email_unique").on(table.email),
		usersGithubIdUnique: unique("users_github_id_unique").on(table.githubId),
	}
});

export const wotds = mysqlTable("wotds", {
	id: varchar("id", { length: 21 }).notNull(),
	definitionId: varchar("definition_id", { length: 20 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		wotdsId: primaryKey({ columns: [table.id], name: "wotds_id"}),
	}
});