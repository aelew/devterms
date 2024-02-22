import { and, desc, eq } from 'drizzle-orm';
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

const getDefinitions = (term: string) =>
  db.query.definitions.findMany({
    where: and(eq(definitions.term, term), eq(definitions.status, 'approved')),
    orderBy: desc(definitions.upvotes),
    with: {
      user: {
        columns: {
          name: true
        }
      }
    }
  });

export function generateMetadata({ params }: DefinitionPageProps) {
  const term = slugToTerm(params.term);
  return { title: `${term.toUpperCase()} Definition` };
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
