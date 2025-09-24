/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ⚡ تجاهل الأخطاء والتحذيرات أثناء build
  },
};

export default nextConfig;
