/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fixes Next inferring an incorrect workspace root when multiple lockfiles exist.
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;

