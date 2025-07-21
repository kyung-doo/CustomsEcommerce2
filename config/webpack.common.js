const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

function getHtmlFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      //if(!filePath.includes('layouts')){
        files = files.concat(getHtmlFiles(filePath));
      //}
    } else if (file.endsWith('.html')) {
      files.push(filePath);
    }
  });

  return files;
}

console.log('html 파일들', getHtmlFiles('./src'))

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + '/scripts/index.js'],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: 'js/[name].bundle.js',
    publicPath: '/',
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].bundle.css',
      chunkFilename: '[id].css',
    }),

    ...getHtmlFiles('./src').map(file => {
      return new HtmlWebpackPlugin({
        template: file,
        filename: path.relative('./src', file),
        minify: false,
        inject: false,
        templateParameters: require('lodash')
      });
    }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: false,
              modules: false,
              url: false,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
  }

}