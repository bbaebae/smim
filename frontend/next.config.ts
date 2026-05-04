import type { NextConfig } from 'next'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  importScripts: ['/sw-push.js'],
})

const nextConfig: NextConfig = {
  /* config options here */
}

export default withPWA(nextConfig)
