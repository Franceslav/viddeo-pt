import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  images: {
    // Отключаем оптимизацию, чтобы локальные файлы из public/uploads отдавались без прокси _next/image
    unoptimized: true,
  }
};

export default nextConfig;
