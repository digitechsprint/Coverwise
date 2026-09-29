/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // Images/JS/CSS/fonts under the scraped WP asset tree (hero banners,
        // Revolution Slider, theme/plugin bundles) default to Cache-Control:
        // max-age=0, forcing a revalidation round-trip on every single visit.
        // Give them a real browser cache so repeat visits load instantly.
        source: '/wp-content/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy WordPress/Yoast sitemap path some crawlers/tools still request.
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
