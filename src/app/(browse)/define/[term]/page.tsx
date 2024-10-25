import { createHmac } from 'crypto';
import { Suspense } from 'react';

import { DefinitionCardSkeleton } from '@/components/definition-card/skeleton';
import { env } from '@/env';
import { getPageMetadata } from '@/lib/seo';
import { slugToTerm } from '@/lib/utils';
import { DefineResultCards, getDefinitions } from './_components/result-cards';

interface DefinitionPageProps {
  params: Promise<{ term: string }>;
}

export async function generateMetadata(props: DefinitionPageProps) {
  const params = await props.params;
  const term = slugToTerm(params.term);

  const results = await getDefinitions(term);
  if (!results.length) {
    return getPageMetadata({ title: `What is ${term}?` });
  }

  const firstResult = results[0]!;

  const hmac = createHmac('sha256', env.OG_HMAC_SECRET);
  hmac.update(JSON.stringify({ slug: params.term }));

  const ogToken = hmac.digest('hex');
  const ogUrl = `${env.NEXT_PUBLIC_BASE_URL}/api/og/${params.term}?t=${ogToken}`;

  return getPageMetadata({
    title: `What is ${firstResult.term}?`,
    description: firstResult.definition,
    twitter: { images: [ogUrl] },
    openGraph: {
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: firstResult.term
        }
      ]
    }
  });
}

export default async function DefinitionPage(props: DefinitionPageProps) {
  const params = await props.params;
  const term = slugToTerm(params.term);
  return (
    <Suspense fallback={<DefinitionCardSkeleton />}>
      <DefineResultCards term={term} />
    </Suspense>
  );
}
