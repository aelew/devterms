import createJiti from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);
jiti('./src/env');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
