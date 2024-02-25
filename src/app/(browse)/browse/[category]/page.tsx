import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { SkeletonDefinitionCard } from '@/components/definition-card/skeleton';
import { getPageMetadata } from '@/lib/seo';
import { CATEGORIES } from '@/lib/utils';
import { CategoryResultCards } from './_components/result-cards';

interface BrowseCategoryPageProps {
  params: {
    category: string;
  };
}

export function generateMetadata({ params }: BrowseCategoryPageProps) {
  return getPageMetadata({
    title: `Browse ${decodeURIComponent(params.category).toUpperCase()} definitions`
  });
}

export default async function BrowseCategoryPage({ params }: BrowseCategoryPageProps) {
  const category = decodeURIComponent(params.category);
  if (!CATEGORIES.includes(category)) {
    notFound();
  }
  return (
    <Suspense
      fallback={
        <>
          <SkeletonDefinitionCard />
          <SkeletonDefinitionCard />
          <SkeletonDefinitionCard />
          <SkeletonDefinitionCard />
          <SkeletonDefinitionCard />
        </>
      }
    >
      <CategoryResultCards category={category} />
    </Suspense>
  );
}
