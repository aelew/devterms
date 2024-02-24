import type { MetadataRoute } from 'next';

import { env } from '@/env';
import { CATEGORIES } from '@/lib/utils';

export function generateSitemaps() {
  return [{ id: 0 }];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return CATEGORIES.map((c) => `/browse/${c}`).map((path) => ({
    url: env.NEXT_PUBLIC_BASE_URL + path,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8
  }));
}
