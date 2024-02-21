'use client';

interface DateProps {
  date: Date | string;
}

export function Time({ date }: DateProps) {
  const dateObj = new Date(date);
  return (
    <time dateTime={dateObj.toISOString()} className="tabular-nums">
      {dateObj.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })}
    </time>
  );
}
