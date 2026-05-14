import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  experimental: {
    typedRoutes: true,
  },
  images: {
    // Skip AVIF on this project. AVIF crushes mid-tone gradients (the entire
    // tonal range of our monochrome pagoda hero) at quality<90; WebP holds
    // those gradients much better at comparable byte sizes.
    formats: ['image/webp'],
    // Bigger upper bound for the auto-generated srcSet so phones with high
    // DPR (3x retina) can pull a 1920w-ish variant when needed instead of
    // upscaling a 1080w.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
  },
};

export default nextConfig;
