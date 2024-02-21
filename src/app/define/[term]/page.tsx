import { and, desc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import { AsideCard } from '@/components/aside-card';
import { DefinitionCard } from '@/components/definition-card';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

interface TermPageProps {
  params: {
    term: string;
  };
}

const getDefinitions = (term: string) =>
  db.query.definitions.findMany({
    orderBy: desc(definitions.upvotes),
    where: and(eq(definitions.term, term), eq(definitions.status, 'approved')),
    with: {
      user: {
        columns: {
          name: true
        }
      }
    }
  });

export async function generateMetadata({ params }: TermPageProps) {
  const results = await getDefinitions(params.term);
  if (!results.length) return {};
  return { title: `Definition of ${params.term}` } satisfies Metadata;
}

export default async function TermPage({ params }: TermPageProps) {
  const results = await getDefinitions(params.term);
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        {results.map((definition) => (
          <DefinitionCard
            key={definition.id}
            definition={definition}
            badges={[]}
          />
        ))}
      </div>
      <AsideCard />
    </div>
  );
}
