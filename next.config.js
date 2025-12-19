/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to allow Vercel standard build (fixes routes-manifest error)
  trailingSlash: true,
  // images: { unoptimized: true } // Removed to allow Vercel Image Optimization
}

module.exports = nextConfig