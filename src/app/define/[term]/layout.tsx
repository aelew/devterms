import type { PropsWithChildren } from 'react';

import { AsideCard } from '@/components/aside-card';

export default function DefinitionLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">{children}</div>
      <AsideCard />
    </div>
  );
}
