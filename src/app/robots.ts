import type { MetadataRoute } from 'next';

import { env } from '@/env';

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: env.NEXT_PUBLIC_BASE_URL + '/sitemap.xml',
    host: env.NEXT_PUBLIC_BASE_URL,
    rules: {
      userAgent: '*',
      allow: '/'
    }
  };
}
