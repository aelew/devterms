import { relations, sql } from 'drizzle-orm';
import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 21 }).primaryKey(),
  name: varchar('name', { length: 32 }),
  role: mysqlEnum('role', ['user', 'moderator']).default('user').notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  avatar: varchar('avatar', { length: 255 }).notNull(),
  githubId: int('github_id', { unsigned: true }).unique().notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  definitions: many(definitions)
}));

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 21 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const definitions = mysqlTable('definitions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 21 }).notNull(),
  status: mysqlEnum('status', ['pending', 'approved', 'denied'])
    .default('pending')
    .notNull(),
  term: varchar('term', { length: 255 }).notNull(),
  definition: text('definition').notNull(),
  example: text('example').notNull(),
  upvotes: int('upvotes', { unsigned: true }).default(0).notNull(),
  downvotes: int('downvotes', { unsigned: true }).default(0).notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const definitionRelations = relations(definitions, ({ one }) => ({
  user: one(users, {
    fields: [definitions.userId],
    references: [users.id]
  })
}));
