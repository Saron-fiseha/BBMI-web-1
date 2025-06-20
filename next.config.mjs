/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Suppress client-side environment variable warnings
    CUSTOM_KEY: '',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  images: {
    domains: ['images.unsplash.com', 'placeholder.svg'],
    unoptimized: true,
  },
  // Suppress build warnings for unused environment variables
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

export default nextConfig
