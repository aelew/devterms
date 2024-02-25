import type { MetadataRoute } from 'next';

import { env } from '@/env';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/browse', '/submit', '/api/docs', '/login', '/about'].map(
    (path) => ({
      url: env.NEXT_PUBLIC_BASE_URL + path,
      priority: path === '/' ? 1 : 0.9,
      changeFrequency: 'daily',
      lastModified: new Date()
    })
  );
}
