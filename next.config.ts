import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages 静态导出（免费、固定网址托管）
  output: 'export',
  basePath: '/starlight-heroine',
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
