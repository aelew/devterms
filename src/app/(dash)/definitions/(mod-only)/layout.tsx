import { notFound, redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { getAuthData } from '@/lib/auth/helpers';

export default async function ModOnlyDashboardLayout({
  children
}: PropsWithChildren) {
  const { user } = await getAuthData();
  if (!user) {
    redirect('/login');
  }
  if (user.role !== 'moderator' && user.role !== 'owner') {
    notFound();
  }
  return <>{children}</>;
}
