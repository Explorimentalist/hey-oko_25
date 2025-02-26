import { config } from 'process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Pages Router for API routes
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Cloudinary image domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
