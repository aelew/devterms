import type { MetadataRoute } from 'next';

import { env } from '@/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticUrls = ['/', '/browse', '/submit', '/api/docs', '/login'].map(
    (path) => ({
      url: env.NEXT_PUBLIC_BASE_URL + path,
      changeFrequency: 'daily' as const,
      priority: path === '/' ? 1 : 0.9,
      lastModified
    })
  );
  return [
    ...staticUrls,
    {
      url:
        env.NEXT_PUBLIC_BASE_URL +
        (env.NODE_ENV === 'production'
          ? '/browse/sitemap/0.xml'
          : '/browse/sitemap.xml/0'),
      changeFrequency: 'daily',
      priority: 0.8,
      lastModified
    },
    {
      url:
        env.NEXT_PUBLIC_BASE_URL +
        (env.NODE_ENV === 'production'
          ? '/define/sitemap/0.xml'
          : '/define/sitemap.xml/0'),
      changeFrequency: 'daily',
      priority: 0.7,
      lastModified
    }
  ];
}
