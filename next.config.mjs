// All browser calls to the Express API go through /backend/* (same origin as the website).
// This keeps the HTTPOnly JWT cookie first-party, so it works on Vercel + Render without
// third-party-cookie problems. API_URL is the address of your Express server.
const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${API_URL}/:path*` }];
  },
};

export default nextConfig;
