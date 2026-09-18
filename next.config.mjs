/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep `next build` output away from the live `next dev` cache.
  // Otherwise a build while dev is running wipes CSS/JS and the whole UI looks "crashed".
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
