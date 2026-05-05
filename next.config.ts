import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  experimental: { optimizePackageImports: ['@react-three/drei', 'lucide-react'] },
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }] },
}

export default nextConfig
