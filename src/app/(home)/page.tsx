import { eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { AsideCard } from '@/components/aside-card';
import { DefinitionCard } from '@/components/definition-card';
import { WordOfTheDay } from '@/components/word-of-the-day';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

export const metadata: Metadata = { title: 'The Developer Dictionary' };

const getHomeFeed = unstable_cache(
  () =>
    db.query.definitions.findMany({
      where: eq(definitions.status, 'approved'),
      orderBy: sql`rand()`,
      limit: 5
    }),
  ['home_feed'],
  { revalidate: 900 }
);

export default async function HomePage() {
  const homeFeed = await getHomeFeed();
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <WordOfTheDay />
        {homeFeed.map((definition) => (
          <DefinitionCard key={definition.id} definition={definition} />
        ))}
      </div>
      <AsideCard />
    </div>
  );
}
