import { desc, eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { AsideCard } from '@/components/aside-card';
import { DefinitionCard } from '@/components/definition-card';
import { db } from '@/server/db';
import { definitions, wotds } from '@/server/db/schema';

export const metadata: Metadata = { title: 'The Developer Dictionary' };

const getWordOfTheDay = unstable_cache(
  () =>
    db.query.wotds.findFirst({
      orderBy: desc(wotds.createdAt),
      with: {
        definition: {
          with: {
            user: true
          }
        }
      }
    }),
  ['wotd']
);

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
  const [wotd, homeFeed] = await Promise.all([
    getWordOfTheDay(),
    getHomeFeed()
  ]);
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        {wotd && (
          <DefinitionCard
            definition={wotd.definition}
            badges={['Word of the day']}
            className="border-muted-foreground shadow-lg"
          />
        )}
        {homeFeed
          .filter((def) => !wotd || def.id !== wotd.id)
          .map((def) => (
            <DefinitionCard key={def.id} definition={def} />
          ))}
      </div>
      <AsideCard />
    </div>
  );
}
