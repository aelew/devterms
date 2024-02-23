import { and, desc, eq, like } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { DefinitionCard } from '@/components/definition-card';
import { CATEGORIES } from '@/lib/definitions';
import { getPageMetadata } from '@/lib/seo';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

interface BrowseCategoryPageProps {
  params: {
    category: string;
  };
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

export function generateMetadata({ params }: BrowseCategoryPageProps) {
  return getPageMetadata({
    title: `Browse ${decodeURIComponent(params.category).toUpperCase()} definitions`
  });
}

export default async function BrowseCategoryPage({
  params
}: BrowseCategoryPageProps) {
  const category = decodeURIComponent(params.category);
  if (!CATEGORIES.includes(category)) {
    notFound();
  }
  const results = await getCategoryDefinitions(category);
  return (
    <>
      {results.map((definition) => (
        <DefinitionCard
          key={definition.id}
          definition={definition}
          badges={[]}
        />
      ))}
    </>
  );
}
