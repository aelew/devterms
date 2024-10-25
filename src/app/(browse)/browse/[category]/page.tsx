import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { DefinitionCardSkeleton } from '@/components/definition-card/skeleton';
import { getPageMetadata } from '@/lib/seo';
import { CATEGORIES } from '@/lib/utils';
import { CategoryResultCards } from './_components/result-cards';

interface BrowseCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata(props: BrowseCategoryPageProps) {
  const params = await props.params;
  return getPageMetadata({
    title: `Browse ${decodeURIComponent(params.category).toUpperCase()} definitions`
  });
}

export default async function BrowseCategoryPage(
  props: BrowseCategoryPageProps
) {
  const params = await props.params;

  const category = decodeURIComponent(params.category);
  if (!CATEGORIES.includes(category)) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <>
          <DefinitionCardSkeleton />
          <DefinitionCardSkeleton />
          <DefinitionCardSkeleton />
          <DefinitionCardSkeleton />
          <DefinitionCardSkeleton />
        </>
      }
    >
      <CategoryResultCards category={category} />
    </Suspense>
  );
}
