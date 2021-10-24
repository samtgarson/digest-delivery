const transpileModules = require('next-transpile-modules')
const { resolve } = require('path')

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({
    config: resolve(__dirname, '../.env')
  })
}

/**
 * @type {import('next').NextConfig}
 */
const config = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
    return config
  }
}

const withTranspile = transpileModules(['@digest-delivery/common'])
module.exports = withTranspile(config)
