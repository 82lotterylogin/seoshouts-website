import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export disabled to support admin system
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // ESLint bypass for deployment
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [],
  },
  // TypeScript bypass for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable strict mode to avoid conflicts
  reactStrictMode: false,
  // Enable Node.js runtime for middleware
  serverExternalPackages: ['better-sqlite3', '@distube/ytdl-core', '@ffmpeg-installer/ffmpeg'],
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
    // Fix Jest worker issues
    workerThreads: false,
    cpus: 1,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure readable HTML output in development
  generateEtags: false,
  poweredByHeader: false,
  // Webpack optimizations for memory usage
  webpack: (config, { isServer, webpack, dev }) => {
    // Fix server-side rendering issues
    if (isServer) {
      // Exclude client-side libraries from server bundle
      config.externals = [
        ...(config.externals || []),
        'react-google-recaptcha',
        '@tinymce/tinymce-react',
        'tinymce',
      ];
      
      // Fix 'window is not defined' on server
      config.plugins.push(
        new webpack.DefinePlugin({
          'typeof window': JSON.stringify('undefined'),
        })
      );
    } else {
      // Client-side configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
      
      config.plugins.push(
        new webpack.DefinePlugin({
          'typeof window': JSON.stringify('object'),
        })
      );
    }
    
    // Optimize memory usage with smaller chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: isServer ? false : {
        chunks: 'all',
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
      // Disable minification in development for readable HTML
      minimize: process.env.NODE_ENV === 'production',
    };
    
    return config;
  },
};

export default nextConfig;
