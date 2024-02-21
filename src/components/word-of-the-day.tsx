import { desc } from 'drizzle-orm';

import { db } from '@/server/db';
import { wotds } from '@/server/db/schema';
import { DefinitionCard } from './definition-card';

export async function WordOfTheDay() {
  const wotd = await db.query.wotds.findFirst({
    orderBy: desc(wotds.createdAt),
    with: {
      definition: {
        with: {
          user: true
        }
      }
    }
  });
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
