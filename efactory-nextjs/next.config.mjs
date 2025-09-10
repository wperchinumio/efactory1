/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable For Static Build Export
  // images: {
  //   unoptimized: true,
  // },
  // trailingSlash: true,
  // output: 'export'
  async rewrites() {
    return [
      { source: "/api/proxy/:path*", destination: "https://efactory.dclcorp.com/:path*" }
    ];
  }
};

export default nextConfig;
