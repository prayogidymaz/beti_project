import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*", // Arahkan ke Django
      },
    ];
  },
  images: {
    domains: ["localhost"], // ✅ Tambahkan ini agar gambar dari localhost:8000 bisa ditampilkan
  },
};

export default nextConfig;
