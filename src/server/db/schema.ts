import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { generateId } from '@/lib/id';

export const users = sqliteTable(
  'users',
  {
    id: text('id', { length: 21 }).primaryKey(),
    name: text('name', { length: 32 }),
    role: text('role', { enum: ['user', 'bot', 'moderator', 'owner'] })
      .default('user')
      .notNull(),
    email: text('email', { length: 255 }).unique().notNull(),
    avatar: text('avatar', { length: 255 }).notNull(),
    githubId: integer('github_id').unique().notNull(),
    createdAt: integer('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
  },
  (table) => {
    return {
      nameIdx: index('users_name_idx').on(table.name),
      roleIdx: index('users_role_idx').on(table.role)
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  definitions: many(definitions)
}));

export const sessions = sqliteTable('sessions', {
  id: text('id', { length: 255 }).primaryKey(),
  userId: text('user_id', { length: 21 }).notNull(),
  expiresAt: integer('expires_at').notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const definitions = sqliteTable(
  'definitions',
  {
    id: text('id', { length: 20 })
      .primaryKey()
      .$defaultFn(() => generateId('def')),
    userId: text('user_id', { length: 21 }).notNull(),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] })
      .default('pending')
      .notNull(),
    term: text('term', { length: 255 }).notNull(),
    definition: text('definition').notNull(),
    example: text('example').notNull(),
    upvotes: integer('upvotes').default(0).notNull(),
    downvotes: integer('downvotes').default(0).notNull(),
    createdAt: integer('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
  },
  (table) => {
    return {
      status: index('definitions_status_idx').on(table.status),
      term: index('definitions_term_idx').on(table.term),
      upvotes: index('definitions_upvotes_idx').on(table.upvotes),
      createdAt: index('definitions_created_at_idx').on(table.createdAt)
    };
  }
);

export const definitionRelations = relations(definitions, ({ one }) => ({
  user: one(users, {
    fields: [definitions.userId],
    references: [users.id]
  })
}));

export const reports = sqliteTable(
  'reports',
  {
    id: text('id', { length: 20 })
      .primaryKey()
      .$defaultFn(() => generateId('rpt')),
    userId: text('user_id', { length: 21 }).notNull(),
    definitionId: text('definition_id', { length: 20 }).notNull(),
    read: integer('read', { mode: 'boolean' }).default(false).notNull(),
    reason: text('reason').notNull(),
    createdAt: integer('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
  },
  (table) => {
    return {
      read: index('reports_read_idx').on(table.read),
      createdAt: index('reports_created_at_idx').on(table.createdAt)
    };
  }
);

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

export const wotds = sqliteTable(
  'wotds',
  {
    id: text('id', { length: 21 })
      .primaryKey()
      .$defaultFn(() => generateId('wotd')),
    definitionId: text('definition_id', { length: 20 }).notNull(),
    createdAt: integer('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
  },
  (table) => {
    return {
      createdAt: index('wotds_created_at_idx').on(table.createdAt)
    };
  }
);

export const wotdRelations = relations(wotds, ({ one }) => ({
  definition: one(definitions, {
    fields: [wotds.definitionId],
    references: [definitions.id]
  })
}));
