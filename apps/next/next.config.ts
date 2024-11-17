import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
