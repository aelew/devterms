'use client';

interface DateProps {
  date: Date;
}

export function Date({ date }: DateProps) {
  return (
    <time dateTime={date.toISOString()} className="tabular-nums">
      {date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })}
    </time>
  );
}
