/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_API,
  },
};

module.exports = nextConfig;
