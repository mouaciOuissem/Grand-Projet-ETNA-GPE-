/** @type {import('next').NextConfig} */

// const nextConfig = {
//   swcMinify: true,
// };
// module.exports = nextConfig;

module.exports = {
  output: "standalone",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}