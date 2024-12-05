import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /* config options here */
  webpack: webpackConfig => {
    webpackConfig.resolve.extensionAlias = {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
      '.jsx': ['.tsx', '.jsx'],
    }

    return webpackConfig
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://localhost:3939/:path*', // Proxy to Backend
        destination: 'http://backend:3939/:path*', // Proxy to Backend
      },
    ]
  },
}

export default nextConfig
