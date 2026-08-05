const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // worker/index.js é compilado e importado dentro do sw.js gerado.
  // É lá que ficam os handlers de push e notificationclick.
  customWorkerSrc: 'worker',
  // Página mostrada quando o usuário navega sem internet para algo ainda não cacheado.
  fallbacks: { document: '/offline' },
  workboxOptions: { disableDevLogs: true },
})

/** @type {import('next').NextConfig} */
module.exports = withPWA({})
