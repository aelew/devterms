import { eq, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { DefinitionCard } from '@/components/definition-card';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';
import { getWordOfTheDay } from './word-of-the-day-card';

const getHomeFeed = unstable_cache(
  () =>
    db.query.definitions.findMany({
      where: eq(definitions.status, 'approved'),
      with: { user: true },
      orderBy: sql`rand()`,
      limit: 5
    }),
  ['home_feed'],
  { revalidate: 900 }
);

export async function HomeFeed() {
  const wotd = await getWordOfTheDay();
  const homeFeed = await getHomeFeed();
  return (
    <>
      {homeFeed
        .filter((definition) => !wotd || definition.id !== wotd.definitionId)
        .map((definition) => (
          <DefinitionCard key={definition.id} definition={definition} />
        ))}
    </>
  );
}
