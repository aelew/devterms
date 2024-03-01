import { Skeleton } from '../ui/skeleton';

export function SkeletonStatistics() {
  return (
    <dl className="grid grid-cols-2 divide-x text-center">
      {['Definitions', 'Posters'].map((label, i) => (
        <div key={i}>
          <dt className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">
            {label}
          </dt>
          <dd className="text-gradient order-first text-3xl font-semibold tracking-tight">
            <Skeleton className="mx-auto h-[1.875rem] w-14" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
