import { createJiti } from 'jiti';
import type { NextConfig } from 'next';

const jiti = createJiti(new URL(import.meta.url).pathname);
jiti.import('./src/env');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['twitter-api-v2'],
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
