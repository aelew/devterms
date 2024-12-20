import { Suspense } from 'react';

import { Aside } from '@/components/aside';
import { DefinitionCardSkeleton } from '@/components/definition-card/skeleton';
import { getPageMetadata } from '@/lib/seo';
import { HomeFeed } from './_components/home-feed';

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = getPageMetadata({ title: 'The Developer Dictionary' });

export default async function HomePage(props: HomePageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) > 1 ? Number(searchParams.page) : 1;

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
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
          <HomeFeed page={page} />
        </Suspense>
      </div>
      <Aside />
    </div>
  );
}
