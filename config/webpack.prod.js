const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { merge } = require('webpack-merge')


const paths = require('./paths')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: false,
  watch: true,
  optimization: {
    minimize: false,
    // minimizer: [new CssMinimizerPlugin(), '...'],
  },
  performance: {
    // hints: false,
    // maxEntrypointSize: 512000,
    // maxAssetSize: 512000,
  },
})