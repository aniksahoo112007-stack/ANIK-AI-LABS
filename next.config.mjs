/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow remote images from any https domain (covers img.sanishtech.com,
    // images.unsplash.com, i.imgur.com, raw.githubusercontent.com, github.com,
    // drive.google.com, lh3.googleusercontent.com, and any other public host).
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
