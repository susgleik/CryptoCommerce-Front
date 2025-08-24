/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // configuration for images from external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.nike.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.adidas.com',
      },
    ]
  }
}
 
module.exports = nextConfig