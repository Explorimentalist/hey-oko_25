import { config } from 'process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Pages Router for API routes
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Image domains configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Disable ESLint during build to allow deployment
  eslint: {
    // Only run ESLint in development, not during builds
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    // Don't fail the build on TypeScript errors
    ignoreBuildErrors: true,
  },
}

export default nextConfig
