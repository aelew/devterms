import { Suspense } from 'react';

import { SkeletonDefinitionCard } from '@/components/definition-card/skeleton';
import { getPageMetadata } from '@/lib/seo';
import { slugToTerm } from '@/lib/utils';
import { DefineResultCards, getDefinitions } from './_components/result-cards';

interface DefinitionPageProps {
  params: {
    term: string;
  };
}

export async function generateMetadata({ params }: DefinitionPageProps) {
  const term = slugToTerm(params.term);
  const results = await getDefinitions(term);
  if (!results.length) {
    return getPageMetadata({ title: `${term} Definition` });
  }
  return getPageMetadata({
    title: `${results[0]!.term} Definition`,
    description: results[0]!.definition
  });
}

export default function DefinitionPage({ params }: DefinitionPageProps) {
  const term = slugToTerm(params.term);
  return (
    <Suspense fallback={<SkeletonDefinitionCard />}>
      <DefineResultCards term={term} />
    </Suspense>
  );
}
