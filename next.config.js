/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker/Cloud Run
  trailingSlash: true,
  images: {
    domains: [], // Add domains if needed
    unoptimized: true // Often safer for standalone if not using Vercel Image Optimization
  }
}

module.exports = nextConfig