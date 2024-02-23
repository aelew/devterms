import { Suspense } from 'react';

import { ClientAside } from './client';
import { Statistics } from './statistics';

export function Aside() {
  return (
    <ClientAside>
      <Suspense>
        <Statistics />
      </Suspense>
    </ClientAside>
  );
}
