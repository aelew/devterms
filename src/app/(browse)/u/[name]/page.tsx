import { Suspense } from 'react';

import { SkeletonDefinitionCard } from '@/components/definition-card/skeleton';
import { getPageMetadata } from '@/lib/seo';
import { getUser, UserResultCards } from './_components/result-cards';

interface ProfilePageProps {
  params: {
    name: string;
  };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const user = await getUser(params.name);
  if (!user) {
    return getPageMetadata({ title: `@${params.name}'s Profile` });
  }
  return getPageMetadata({
    title: `@${user.name}'s Profile`,
    description: `Check out ${user.name}'s definitions on DevTerms!`
  });
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <Suspense
      fallback={
        <>
          <SkeletonDefinitionCard />
          <SkeletonDefinitionCard />
        </>
      }
    >
      <UserResultCards name={params.name} />
    </Suspense>
  );
}
