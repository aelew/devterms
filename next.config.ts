import type { NextConfig } from 'next';

import '@/env';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['twitter-api-v2'],
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
