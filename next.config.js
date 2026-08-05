const isPWA = process.env.NEXT_PUBLIC_BUILD_TARGET !== 'capacitor'

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: !isPWA,
  // worker/index.js é compilado e importado dentro do sw.js gerado.
  // É lá que ficam os handlers de push e notificationclick.
  customWorkerSrc: 'worker',
  // Página mostrada quando o usuário navega sem internet para algo ainda não cacheado.
  fallbacks: { document: '/offline' },
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
