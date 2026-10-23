/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: []
  },
  // Baseline security headers on every response. A full Content-Security-Policy
  // is intentionally NOT set here: this app loads several third-party embeds
  // (Calendly, Leaflet tiles, 3D assets) and a guessed CSP would break them;
  // clickjacking is covered by X-Frame-Options below. Add a tested CSP
  // (report-only first) before enabling one in production.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
