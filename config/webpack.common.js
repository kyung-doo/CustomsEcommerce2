const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally')

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

function getHtmlFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if(!filePath.includes('layouts')){
        files = files.concat(getHtmlFiles(filePath));
      }
    } else if (file.endsWith('.html')) {
      files.push(filePath);
    }
  });

  return files;
}

console.log('html 파일들', getHtmlFiles('./src'))


class MergeFolderPlugin {
  constructor(options) {
    this.folder = options.folder;
    this.output = options.output || 'merged.js';
    this.extensions = options.extensions || ['.js'];
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('MergeFolderPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'MergeFolderPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const folderPath = path.resolve(compiler.context, this.folder);

          // 병합 대상 파일 목록
          const files = fs.readdirSync(folderPath)
            .filter(file => this.extensions.includes(path.extname(file)))
            .sort();

          // ✅ 변경 감지 대상 등록
          files.forEach(file => {
            const filePath = path.join(folderPath, file);
            compilation.fileDependencies.add(filePath);
          });

          // 병합 수행
          let mergedContent = '';
          files.forEach(file => {
            const filePath = path.join(folderPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            mergedContent += `\n/* ${file} */\n` + content;
          });

          // 변경 감지 보장: 기존 자산 삭제 후 새로 등록
          if (compilation.getAsset(this.output)) {
            compilation.deleteAsset(this.output);
          }

          compilation.emitAsset(
            this.output,
            new compiler.webpack.sources.RawSource(mergedContent),
            {
              immutable: false,
              size: mergedContent.length,
            }
          );

          console.log(`[MergeFolderPlugin] 메모리에 병합 완료: ${this.output}`);
        }
      );
    });

    // dev 모드에서 watch 시 로그 출력 (디버깅용)
    compiler.hooks.watchRun.tapAsync('MergeFolderPlugin', (comp, callback) => {
      console.log(`[MergeFolderPlugin] watchRun triggered`);
      callback();
    });
  }
}






module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
    common: './src/styles/index.scss',
    components: './src/styles/components/index.scss',
    layouts: './src/styles/layouts/index.scss',
    pages: './src/styles/pages/index.scss',
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
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
        {
          from: 'src/scripts/index.js',
          to: 'js/index.js'
        },
        {
          from: 'src/libs',
          to: 'libs'
        }
      ],
    }),

    new MergeFolderPlugin({
      folder: 'src/scripts/components',
      output: 'js/components.js',
      extensions: ['.js']
    }),

    new MergeFolderPlugin({
      folder: 'src/scripts/layouts',
      output: 'js/layouts.js',
      extensions: ['.js']
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
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

  // resolve: {
  //   modules: [paths.src, 'node_modules'],
  //   extensions: ['.js', '.jsx', '.json'],
  //   alias: {
  //     '@': paths.src,
  //     assets: paths.public,
  //   },
  // }

}