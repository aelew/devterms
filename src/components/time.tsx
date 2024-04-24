'use client';

import type { Timestamp } from '@/types';

interface DateProps {
  timestamp: Timestamp;
  mode?: 'short' | 'long';
}

export function Time({ timestamp, mode = 'long' }: DateProps) {
  const dateObj = new Date(timestamp);
  return (
    <time dateTime={dateObj.toISOString()} className="tabular-nums">
      {dateObj.toLocaleDateString(
        undefined,
        mode === 'short'
          ? { year: '2-digit', month: '2-digit', day: '2-digit' }
          : { year: 'numeric', month: 'long', day: 'numeric' }
      )}
    </time>
  );
}
