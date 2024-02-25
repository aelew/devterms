import { and, desc, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { DefinitionCard } from '@/components/definition-card';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

interface DefineResultCardsProps {
  term: string;
}

export const getDefinitions = unstable_cache(
  (term: string) =>
    db.query.definitions.findMany({
      orderBy: desc(definitions.upvotes),
      where: and(
        eq(definitions.status, 'approved'),
        eq(definitions.term, term)
      ),
      with: {
        user: {
          columns: {
            name: true
          }
        }
      }
    }),
  ['definitions'],
  { revalidate: 1800 }
);

export async function DefineResultCards({ term }: DefineResultCardsProps) {
  const results = await getDefinitions(term);
  if (!results.length) {
    notFound();
  }
  return (
    <>
      {results.map((definition) => (
        <DefinitionCard
          definition={definition}
          key={definition.id}
          badges={[]}
        />
      ))}
    </>
  );
}
