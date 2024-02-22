import { and, desc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { DefinitionCard } from '@/components/definition-card';
import { slugToTerm } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

interface DefinitionPageProps {
  params: {
    term: string;
  };
}

const getDefinitions = unstable_cache(
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

export async function generateMetadata({ params }: DefinitionPageProps) {
  const term = slugToTerm(params.term);
  const results = await getDefinitions(term);
  if (!results.length) {
    return { title: `${term} Definition` };
  }
  return {
    title: `${results[0].term} Definition`,
    description: results[0].definition
  } satisfies Metadata;
}

export default async function DefinitionPage({ params }: DefinitionPageProps) {
  const term = slugToTerm(params.term);
  const results = await getDefinitions(term);
  if (!results.length) {
    notFound();
  }
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
