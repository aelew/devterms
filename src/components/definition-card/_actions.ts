'use server';

import { and, eq, gte, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { protectedAction } from '@/lib/action';
import { db } from '@/server/db';
import { definitions, reports } from '@/server/db/schema';
import { reportFormSchema } from './schema';

export type VoteAction = 'increment' | 'decrement';

export async function updateUpvoteCount(
  definitionId: string,
  pathname: string,
  action: VoteAction
) {
  const n = action === 'increment' ? 1 : -1;
  await db
    .update(definitions)
    .set({ upvotes: sql`${definitions.upvotes} + ${n}` })
    .where(
      and(
        eq(definitions.id, definitionId),
        gte(definitions.upvotes, n === -1 ? 1 : 0)
      )
    );
  revalidatePath(pathname);
}

export async function updateDownvoteCount(
  definitionId: string,
  pathname: string,
  action: VoteAction
) {
  const n = action === 'increment' ? 1 : -1;
  await db
    .update(definitions)
    .set({ downvotes: sql`${definitions.downvotes} + ${n}` })
    .where(
      and(
        eq(definitions.id, definitionId),
        gte(definitions.downvotes, n === -1 ? 1 : 0)
      )
    );
  revalidatePath(pathname);
}

// TODO: Implement CF Turnstile captcha
export const reportDefinition = protectedAction(
  reportFormSchema,
  async ({ definitionId, reason }, { user }) => {
    await db.insert(reports).values({ userId: user.id, definitionId, reason });
    return { message: 'Your report has been submitted!' };
  }
);
