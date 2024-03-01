'use server';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { and, eq, gte, sql } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';

import { protectedAction } from '@/lib/action';
import { termToSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions, reports, wotds } from '@/server/db/schema';
import { reportFormSchema } from './schema';

export type VoteAction = 'increment' | 'decrement';

const getTermFromId = (id: string) =>
  db.query.definitions.findFirst({
    where: eq(definitions.id, id),
    columns: { term: true }
  });

const getClientIp = () => {
  const headersList = headers();
  return (
    headersList.get('cf-connecting-ip') ??
    headersList.get('x-forwarded-for') ??
    '127.0.0.1'
  );
};

const enforceRateLimit = async () => {
  const ip = getClientIp();
  const { success } = await ratelimit.limit(`${ip}:votes`);
  if (!success) {
    return { message: 'Whoa! Slow down a little, will ya?' };
  }
};

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10s')
});

export async function updateUpvoteCount(
  definitionId: string,
  action: VoteAction
) {
  const error = await enforceRateLimit();
  if (error) return error;

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

  const termResult = await getTermFromId(definitionId);
  if (!termResult) {
    return { message: 'Term not found' };
  }

  revalidateTag(`definitions:${termToSlug(termResult.term)}`);

  // revalidate the home feed if the definition is a WOTD
  const wotdEntry = await db.query.wotds.findFirst({
    where: eq(wotds.definitionId, definitionId),
    columns: { id: true }
  });
  if (wotdEntry) {
    revalidateTag('home_feed');
  }
}

export async function updateDownvoteCount(
  definitionId: string,
  action: VoteAction
) {
  const error = await enforceRateLimit();
  if (error) return error;

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
  const termResult = await getTermFromId(definitionId);
  if (!termResult) {
    return { message: 'Term not found' };
  }

  revalidateTag(`definitions:${termToSlug(termResult.term)}`);

  // revalidate the home feed if the definition is a WOTD
  const wotdEntry = await db.query.wotds.findFirst({
    where: eq(wotds.definitionId, definitionId),
    columns: { id: true }
  });
  if (wotdEntry) {
    revalidateTag('home_feed');
  }
}

// TODO: Implement CF Turnstile captcha
export const reportDefinition = protectedAction(
  reportFormSchema,
  async ({ definitionId, reason }, { user }) => {
    await db.insert(reports).values({ userId: user.id, definitionId, reason });
    return { message: 'Your report has been submitted!' };
  }
);
