/** @type {import('next').NextConfig} */

// const nextConfig = {
//   swcMinify: true,
// };
// module.exports = nextConfig;

module.exports = {
  basePath: '/prsy-adm',
  output: "standalone",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}