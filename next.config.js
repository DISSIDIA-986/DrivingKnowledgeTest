/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/DrivingKnowledgeTest',
  assetPrefix: '/DrivingKnowledgeTest/',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig