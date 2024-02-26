import { count } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { db } from '@/server/db';
import { definitions, users } from '@/server/db/schema';

const getCachedDefinitionCount = unstable_cache(
  async () => {
    const result = await db.select({ rows: count() }).from(definitions);
    return result[0]?.rows ?? 0;
  },
  ['definition_count'],
  { revalidate: 1800 }
);

const getCachedUserCount = unstable_cache(
  async () => {
    const result = await db.select({ rows: count() }).from(users);
    return result[0]?.rows ?? 0;
  },
  ['user_count'],
  { revalidate: 1800 }
);

export async function Statistics() {
  const [definitionCount, userCount] = await Promise.all([
    getCachedDefinitionCount(),
    getCachedUserCount()
  ]);
  const stats = [
    { label: 'Definitions', value: definitionCount },
    { label: 'Posters', value: userCount }
  ];
  return (
    <dl className="grid grid-cols-2 divide-x text-center">
      {stats.map(({ label, value }) => (
        <div key={label}>
          <dt className="text-xs font-semibold uppercase text-muted-foreground">
            {label}
          </dt>
          <dd className="text-gradient order-first text-3xl font-semibold tracking-tight">
            {value.toLocaleString()}
          </dd>
        </div>
      ))}
    </dl>
  );
}
