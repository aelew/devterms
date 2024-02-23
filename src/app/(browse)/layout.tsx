import type { PropsWithChildren } from 'react';

import { Aside } from '@/components/aside';

export default function BrowseLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">{children}</div>
      <Aside />
    </div>
  );
}
