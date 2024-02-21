import { desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { db } from '@/server/db';
import { wotds } from '@/server/db/schema';
import { DefinitionCard } from './definition-card';

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

export async function WordOfTheDay() {
  const wotd = await getWordOfTheDay();
  if (!wotd) {
    return null;
  }
  return (
    <DefinitionCard
      definition={wotd.definition}
      badges={['Word of the day']}
      className="border-muted-foreground shadow-lg"
    />
  );
}
