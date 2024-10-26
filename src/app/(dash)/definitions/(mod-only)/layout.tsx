import { notFound, redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { getCurrentSession } from '@/lib/auth';

export default async function ModOnlyDashboardLayout({
  children
}: PropsWithChildren) {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect('/login');
  }
  if (user.role !== 'moderator' && user.role !== 'owner') {
    notFound();
  }
  return <>{children}</>;
}
