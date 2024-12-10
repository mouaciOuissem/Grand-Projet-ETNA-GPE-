/** @type {import('next').NextConfig} */

// const nextConfig = {
//   swcMinify: false,
// };

// module.exports = nextConfig;
module.exports = {
  output: "standalone",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}