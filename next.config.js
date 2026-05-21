const isPWA = process.env.NEXT_PUBLIC_BUILD_TARGET !== 'capacitor'

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: !isPWA,
  workboxOptions: { disableDevLogs: true },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportação estática para Capacitor (sem API routes nesse modo)
  output: process.env.NEXT_PUBLIC_BUILD_TARGET === 'capacitor' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = withPWA(nextConfig)
