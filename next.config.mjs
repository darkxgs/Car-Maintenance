/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Force rebuild for AI service fix
  // Ensure proper RTL support
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
};

export default nextConfig;
