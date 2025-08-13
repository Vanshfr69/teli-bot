/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS, POST" },
        { key: "Access-Control-Allow-Headers", value: "*" }
      ]
    }
  ]
};
export default nextConfig;
