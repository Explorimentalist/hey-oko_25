import { config } from 'process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable both App and Pages Router
  experimental: {
    appDir: true,
  },
  // Enable Pages Router for API routes
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Cloudinary image domain
  images: {
    domains: ['res.cloudinary.com'],
  },
}

export default nextConfig
