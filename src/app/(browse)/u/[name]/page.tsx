import { Suspense } from 'react';

import { DefinitionCardSkeleton } from '@/components/definition-card/skeleton';
import { getPageMetadata } from '@/lib/seo';
import { getUser, UserResultCards } from './_components/result-cards';

interface ProfilePageProps {
  params: Promise<{
    name: string;
  }>;
}

export async function generateMetadata(props: ProfilePageProps) {
  const params = await props.params;
  const user = await getUser(params.name);
  if (!user) {
    return getPageMetadata({ title: `@${params.name}'s Profile` });
  }
  return getPageMetadata({
    title: `@${user.name}'s Profile`,
    description: `Check out ${user.name}'s definitions on DevTerms!`
  });
}

export default async function ProfilePage(props: ProfilePageProps) {
  const params = await props.params;
  return (
    <Suspense
      fallback={
        <>
          <DefinitionCardSkeleton />
          <DefinitionCardSkeleton />
        </>
      }
    >
      <UserResultCards name={params.name} />
    </Suspense>
  );
}
