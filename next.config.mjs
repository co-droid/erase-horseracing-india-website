/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: Using SSR for admin dashboard. GitHub Pages deployment will need adjustment.
  // For static export, use: output: "export"
  // basePath: "/erase-horseracing-india-website", // Disabled for local testing
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

