import { desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { DefinitionCard } from '@/components/definition-card';
import { db } from '@/server/db';
import { wotds } from '@/server/db/schema';

export const getWordOfTheDay = unstable_cache(
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
  ['wotd'],
  { revalidate: 900 }
);

export async function WordOfTheDayCard() {
  const wotd = await getWordOfTheDay();
  if (!wotd) {
    return null;
  }
  return (
    <DefinitionCard
      className="border-muted-foreground shadow-lg"
      definition={wotd.definition}
      badges={['Word of the day']}
    />
  );
}
