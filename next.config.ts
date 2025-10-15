import type { NextConfig } from "next";

// Type assertion to handle next-pwa compatibility issues
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*\.(png|jpg|jpeg|webp|svg|gif|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "eurotel-images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https?.*\.(js|css|woff|woff2|ttf|eot)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "eurotel-static-assets",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https?.*\/api\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "eurotel-api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 3,
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "eurotel-pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 3,
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ["!robots.txt", "!sitemap.xml"],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/webp", "image/avif"],
    domains: [
      "localhost",
      // Add your image domains here if you're using external images
    ],
  },
  // Enable experimental features if needed
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Add any other configurations you need
};

export default withPWA(nextConfig) as NextConfig;
