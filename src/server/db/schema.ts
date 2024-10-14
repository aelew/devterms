import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { generateId } from '@/lib/id';

export const users = sqliteTable(
  'users',
  {
    id: text({ length: 21 }).primaryKey(),
    name: text({ length: 32 }),
    role: text({ enum: ['user', 'bot', 'moderator', 'owner'] })
      .default('user')
      .notNull(),
    email: text({ length: 255 }).unique().notNull(),
    avatar: text({ length: 255 }).notNull(),
    githubId: integer().unique().notNull(),
    createdAt: integer()
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
  id: text({ length: 255 }).primaryKey(),
  userId: text({ length: 21 }).notNull(),
  expiresAt: integer().notNull()
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
    userId: text({ length: 21 }).notNull(),
    status: text({ enum: ['pending', 'approved', 'rejected'] })
      .default('pending')
      .notNull(),
    term: text({ length: 255 }).notNull(),
    definition: text().notNull(),
    example: text().notNull(),
    upvotes: integer().default(0).notNull(),
    downvotes: integer().default(0).notNull(),
    createdAt: integer()
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
    userId: text({ length: 21 }).notNull(),
    definitionId: text({ length: 20 }).notNull(),
    read: integer({ mode: 'boolean' }).default(false).notNull(),
    reason: text().notNull(),
    createdAt: integer()
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
    id: text({ length: 21 })
      .primaryKey()
      .$defaultFn(() => generateId('wotd')),
    definitionId: text({ length: 20 }).notNull(),
    createdAt: integer()
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
