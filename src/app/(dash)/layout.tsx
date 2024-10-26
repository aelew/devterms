import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { getCurrentSession } from '@/lib/auth';
import { DashboardNavigation } from './navigation';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect('/login');
  }
  const isModerator = user.role === 'moderator' || user.role === 'owner';
  return (
    <div className="relative space-y-2">
      <DashboardNavigation isModerator={isModerator} />
      <div>{children}</div>
    </div>
  );
}
