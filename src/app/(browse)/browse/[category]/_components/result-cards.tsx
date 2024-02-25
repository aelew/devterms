import { and, desc, eq, like } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { DefinitionCard } from '@/components/definition-card';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

interface CategoryResultCardsProps {
  category: string;
}

const getCategoryDefinitions = unstable_cache(
  (category: string) =>
    db.query.definitions.findMany({
      ...(category === 'new'
        ? {
            orderBy: desc(definitions.createdAt),
            where: and(eq(definitions.status, 'approved')),
            limit: 10
          }
        : {
            orderBy: desc(definitions.term),
            where: and(
              eq(definitions.status, 'approved'),
              like(definitions.term, category + '%')
            )
          }),
      with: {
        user: {
          columns: {
            name: true
          }
        }
      }
    }),
  ['category_definitions'],
  { revalidate: 1800 }
);

export async function CategoryResultCards({
  category
}: CategoryResultCardsProps) {
  const results = await getCategoryDefinitions(category);
  if (!results.length) {
    return <p>No definitions in this category</p>;
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
