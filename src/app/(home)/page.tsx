import type { Metadata } from 'next';

import { AsideCard } from '@/components/aside-card';
import { WordOfTheDay } from '@/components/word-of-the-day';

export const metadata: Metadata = { title: 'The Developer Dictionary' };

export default function HomePage() {
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <WordOfTheDay />
        {/* TODO: Random feed */}
      </div>
      <AsideCard />
    </div>
  );
}
