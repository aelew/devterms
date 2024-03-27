import createJiti from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);
jiti('./src/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
