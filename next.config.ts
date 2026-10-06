import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.mbbsinkazak.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "cdn.mbbsinkazak.com",
        pathname: "/**",
      },
      // Placeholder / fallback images
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      // Supabase storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      // R2/S3 support
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  // Rewrites for legacy URL support (from old React app)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'mbbsinvietnam.com',
          },
        ],
        destination: 'https://www.mbbsinkazak.com/:path*',
        permanent: true,
      },
      {
        source: "/blog-news/:path*",
        destination: "/blog/:path*",
        permanent: true,
      },
      {
        source: "/blog-article/:path*",
        destination: "/articles/:path*",
        permanent: true,
      },
      {
        source: "/auth",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/auth/otp-verification",
        destination: "/otp-verification",
        permanent: true,
      },
      {
        source: "/auth/password/reset",
        destination: "/password/reset",
        permanent: true,
      },
      {
        source: "/student-dashboard/:path*",
        destination: "/student/:path*",
        permanent: true,
      },
      {
        source: "/universities/:slug/mbbscourses/:programSlug",
        destination: "/universities/:slug/courses/:programSlug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
  // Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
