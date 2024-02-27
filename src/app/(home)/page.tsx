import { Suspense } from 'react';

import { Aside } from '@/components/aside';
import { SkeletonDefinitionCard } from '@/components/definition-card/skeleton';
import { getPageMetadata } from '@/lib/seo';
import { HomeFeed } from './_components/home-feed';

interface HomePageProps {
  searchParams: {
    page?: string;
  };
}

export const metadata = getPageMetadata({ title: 'The Developer Dictionary' });

export default function HomePage({ searchParams }: HomePageProps) {
  const page = Number(searchParams.page) > 1 ? Number(searchParams.page) : 1;
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
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
          <HomeFeed page={page} />
        </Suspense>
      </div>
      <Aside />
    </div>
  );
}
