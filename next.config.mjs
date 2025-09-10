import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti.import('./src/env');

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['twitter-api-v2'],
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
