/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable SWC minification to preserve exact JS behavior
  swcMinify: false,
  // Ensure proper RTL support
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
};

export default nextConfig;
