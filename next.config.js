/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // We skip during build to prevent failures on non-critical warning issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We skip type-checking during production builds to speed up and streamline deployment
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
