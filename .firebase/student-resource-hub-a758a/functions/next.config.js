"use strict";

// next.config.js
var nextConfig = {
  output: "standalone",
  // Required for Docker/Cloud Run
  trailingSlash: true,
  images: {
    domains: [],
    // Add domains if needed
    unoptimized: true
    // Often safer for standalone if not using Vercel Image Optimization
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" }
        ]
      }
    ];
  }
};
module.exports = nextConfig;
