import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  compiler: {
    // Включаем стабильные ID для SSR
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  // Отключаем SSR для компонентов с проблемами гидратации
  transpilePackages: ['@mui/material', '@mui/icons-material'],
};

export default nextConfig;
