/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper RTL support
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
};

export default nextConfig;
