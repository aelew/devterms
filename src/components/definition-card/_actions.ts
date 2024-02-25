'use server';

import { eq, sql } from 'drizzle-orm';

import { protectedAction } from '@/lib/action';
import { db } from '@/server/db';
import { definitions, reports } from '@/server/db/schema';
import { reportFormSchema } from './schema';

export async function updateUpvoteCount(
  definitionId: string,
  action: 'increment' | 'decrement'
) {
  const n = action === 'increment' ? 1 : -1;
  await db
    .update(definitions)
    .set({ upvotes: sql`${definitions.upvotes} + ${n}` })
    .where(eq(definitions.id, definitionId));
}

export async function updateDownvoteCount(
  definitionId: string,
  action: 'increment' | 'decrement'
) {
  const n = action === 'increment' ? 1 : -1;
  await db
    .update(definitions)
    .set({ downvotes: sql`${definitions.downvotes} + ${n}` })
    .where(eq(definitions.id, definitionId));
}

// TODO: Implement CF Turnstile captcha
export const reportDefinition = protectedAction(
  reportFormSchema,
  async ({ definitionId, reason }, { user }) => {
    await db.insert(reports).values({ userId: user.id, definitionId, reason });
    return { message: 'Your report has been submitted!' };
  }
);
