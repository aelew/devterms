import { Suspense } from 'react';

import { Aside } from '@/components/aside';
import { SkeletonDefinitionCard } from '@/components/definition-card/skeleton';
import { getPageMetadata } from '@/lib/seo';
import { HomeFeed } from './_components/home-feed';
import { WordOfTheDayCard } from './_components/word-of-the-day-card';

export const metadata = getPageMetadata({ title: 'The Developer Dictionary' });

export default function HomePage() {
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <Suspense fallback={<SkeletonDefinitionCard />}>
          <WordOfTheDayCard />
        </Suspense>
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
          <HomeFeed />
        </Suspense>
      </div>
      <Aside />
    </div>
  );
}
