'use server';

import { eq, sql } from 'drizzle-orm';

import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

export async function updateUpvoteCount(
  definitionId: string,
  action: 'increment' | 'decrement'
) {
  await db
    .update(definitions)
    .set({
      upvotes: sql`${definitions.upvotes} + ${action === 'increment' ? 1 : -1}`
    })
    .where(eq(definitions.id, definitionId));
}

export async function updateDownvoteCount(
  definitionId: string,
  action: 'increment' | 'decrement'
) {
  await db
    .update(definitions)
    .set({
      downvotes: sql`${definitions.downvotes} + ${action === 'increment' ? 1 : -1}`
    })
    .where(eq(definitions.id, definitionId));
}
