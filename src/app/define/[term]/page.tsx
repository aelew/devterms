import { and, desc, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { DefinitionCard } from '@/components/definition-card';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

interface DefinitionPageProps {
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

export function generateMetadata({ params }: DefinitionPageProps) {
  const term = decodeURIComponent(params.term);
  return { title: `${term.toUpperCase()} Definition` };
}

export default async function DefinitionPage({ params }: DefinitionPageProps) {
  const term = decodeURIComponent(params.term);
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
