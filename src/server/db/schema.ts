import { relations, sql } from 'drizzle-orm';
import {
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
  email: varchar('email', { length: 255 }).unique().notNull(),
  image: varchar('image', { length: 255 }),
  googleId: varchar('google_id', { length: 21 }).unique(),
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

export const magicTokens = mysqlTable('magic_tokens', {
  id: varchar('id', { length: 20 })
    .primaryKey()
    .$defaultFn(() => generateId('mgc')),
  userId: varchar('user_id', { length: 21 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const magicTokenRelations = relations(magicTokens, ({ one }) => ({
  user: one(users, {
    fields: [magicTokens.userId],
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
