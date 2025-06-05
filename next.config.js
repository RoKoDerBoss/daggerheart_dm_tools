/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js'
  },
  
  // Disable server-side features not needed for static export
  poweredByHeader: false,
  
  // Configure build optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Configure redirect handling for SPA behavior
  async generateBuildId() {
    return 'daggerheart-dm-tools-build'
  }
}

module.exports = nextConfig 