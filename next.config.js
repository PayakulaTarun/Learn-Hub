/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  output: isDev ? undefined : 'export', // Export for Prod, Dynamic for Dev
  trailingSlash: true, // Required for Firebase clean URLs
  images: {
    domains: [], // Add domains if needed
    unoptimized: true // Often safer for standalone if not using Vercel Image Optimization
  },
  // Headers are handled in firebase.json for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    if (isDev) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:5001/student-resource-hub-a758a/us-central1/api/:path*',
        },
      ];
    }
    return [];
  },
}

module.exports = nextConfig