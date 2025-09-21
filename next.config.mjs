/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // Turbopack devre dışı bırakılıyor, Webpack kullanılacak
  },
};

export default nextConfig;
