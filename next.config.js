/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: { cacheName: "google-fonts", expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/.*\.googleapis\.com\/maps\/.*/i,
      handler: "NetworkFirst",
      options: { cacheName: "google-maps", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 } },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: { cacheName: "next-static", expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /\/_next\/image\?.*/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "next-image", expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 } },
    },
    {
      urlPattern: /^\/dashboard.*/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "dashboard-pages", expiration: { maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 } },
    },
  ],
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http://localhost:8000 https://maps.gstatic.com https://maps.googleapis.com",
              "connect-src 'self' http://localhost:8000 https://*.tile.openstreetmap.org https://fonts.googleapis.com https://maps.googleapis.com https://maps.gstatic.com https://vision.googleapis.com https://places.googleapis.com",
              "frame-src 'none'",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // Disable x-powered-by header
  poweredByHeader: false,
};

module.exports = withPWA(nextConfig);
