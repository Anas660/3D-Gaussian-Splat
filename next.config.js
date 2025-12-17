/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for API routes
  staticPageGenerationTimeout: 1000,

  // Increase body size limit for file uploads
  serverRuntimeConfig: {
    bodyParser: {
      sizeLimit: "5gb",
    },
  },

  // Configure API routes
  api: {
    bodyParser: {
      sizeLimit: "5gb",
    },
    responseLimit: "5gb",
  },

  // Image optimization for thumbnails
  images: {
    unoptimized: true,
  },

  // Allow dynamic pages
  dynamicParams: true,
};

module.exports = nextConfig;
