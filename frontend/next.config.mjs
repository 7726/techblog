/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com', // S3 이미지 로드 허용
      },
    ],
  },
  reactStrictMode: false, 
};

export default nextConfig;