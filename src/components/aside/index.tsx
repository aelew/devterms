import { Suspense } from 'react';

import { Statistics } from '../statistics';
import { StatisticsSkeleton } from '../statistics/skeleton';
import { ClientAside } from './client';

export function Aside() {
  return (
    <ClientAside>
      <Suspense fallback={<StatisticsSkeleton />}>
        <Statistics />
      </Suspense>
    </ClientAside>
  );
}
