'use client';

interface DateProps {
  date: Date | string;
  mode?: 'short' | 'long';
}

export function Time({ date, mode = 'long' }: DateProps) {
  const dateObj = new Date(date);
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
