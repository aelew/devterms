import { Suspense } from 'react';

import { Statistics } from '../statistics';
import { SkeletonStatistics } from '../statistics/skeleton';
import { ClientAside } from './client';

export function Aside() {
  return (
    <ClientAside>
      <Suspense fallback={<SkeletonStatistics />}>
        <Statistics />
      </Suspense>
    </ClientAside>
  );
}
