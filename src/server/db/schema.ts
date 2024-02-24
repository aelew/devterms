import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core';

import { generateId } from '@/lib/id';

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
  id: varchar('id', { length: 20 })
    .primaryKey()
    .$defaultFn(() => generateId('def')),
  userId: varchar('user_id', { length: 21 }).notNull(),
  status: mysqlEnum('status', ['pending', 'approved', 'rejected'])
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

export const reports = mysqlTable('reports', {
  id: varchar('id', { length: 20 })
    .primaryKey()
    .$defaultFn(() => generateId('rpt')),
  userId: varchar('user_id', { length: 21 }).notNull(),
  definitionId: varchar('definition_id', { length: 20 }).notNull(),
  read: boolean('read').default(false).notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const reportRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id]
  }),
  definition: one(definitions, {
    fields: [reports.definitionId],
    references: [definitions.id]
  })
}));

export const wotds = mysqlTable('wotds', {
  id: varchar('id', { length: 21 })
    .primaryKey()
    .$defaultFn(() => generateId('wotd')),
  definitionId: varchar('definition_id', { length: 20 }).notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const wotdRelations = relations(wotds, ({ one }) => ({
  definition: one(definitions, {
    fields: [wotds.definitionId],
    references: [definitions.id]
  })
}));
