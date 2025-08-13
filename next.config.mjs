/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { bodySizeLimit: '10mb' } },
  // Helpful for video Range requests through the proxy
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "*" }
      ]
    }
  ]
};
export default nextConfig;
