// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  webpack: (config, { webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))

    // Important: return the modified config
    return config
  },
  publicRuntimeConfig: {
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseUrl: process.env.SUPABASE_URL
  }
}
