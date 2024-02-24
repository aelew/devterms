import { eq } from 'drizzle-orm';
import type { MetadataRoute } from 'next';

import { env } from '@/env';
import { termToSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

export function generateSitemaps() {
  return [{ id: 0 }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allDefinitions = await db.query.definitions.findMany({
    where: eq(definitions.status, 'approved'),
    columns: { term: true }
  });
  return allDefinitions.map((def) => ({
    url: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(def.term)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7
  }));
}
