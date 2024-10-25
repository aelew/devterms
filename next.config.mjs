import { createJiti } from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);
jiti.import('./src/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['twitter-api-v2'],
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
