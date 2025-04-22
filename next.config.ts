import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: "export", // Necesario para GitHub Pages o Vercel static export
  experimental: {
    // asyncParams: false, // Asegúrate de NO tener esto en true
  },
};

export default nextConfig;
