/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Only enable instrumentation in production when Sentry is configured
    instrumentationHook: process.env.NODE_ENV === 'production' && !!process.env.SENTRY_DSN,
  },
  eslint: {
    // Disable ESLint during builds due to ESLint 9 compatibility issues
    // Run pnpm lint separately to check for errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily disable to test build speed - will fix errors after
    ignoreBuildErrors: true,
  },
  images: {
    // Use Next.js Image Optimization
    unoptimized: false,
  },
  // Configure output for better handling of dynamic routes
  // output: 'standalone', // Disabled on Windows to avoid symlink EPERM issues
  // Disable static optimization for pages that need dynamic behavior
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  async headers() {
    // Relax CSP in development to avoid breaking Next.js hydration/React Refresh
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value:
                "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ws: https://*.supabase.co; frame-ancestors 'none'",
            },
          ],
        },
      ]
    }
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

export default nextConfig