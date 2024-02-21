import type { Metadata } from 'next';

import { db } from '@/server/db';
import { AsideCard } from '../../components/aside-card';
import { DefinitionCard } from '../../components/definition-card';

export const metadata: Metadata = { title: 'The Developer Dictionary' };

export default async function Home() {
  const definition = await db.query.definitions.findFirst({
    with: {
      user: {
        columns: {
          name: true
        }
      }
    }
  });
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        {definition && (
          <>
            <DefinitionCard
              definition={definition}
              badges={['Word of the day']}
              className="border-primary shadow-lg"
            />
            <DefinitionCard definition={definition} badges={[]} />
          </>
        )}
      </div>
      <AsideCard />
    </div>
  );
}
