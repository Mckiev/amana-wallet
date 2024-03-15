const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    mode: isProduction
      ? 'production'
      : 'development',
    entry: './src/renderer/index.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'webpack-dist/src/main/renderer'),
      publicPath: './',
    },
    target: 'electron-renderer',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/u,
          use: 'ts-loader',
          exclude: /node_modules/u,
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isProduction
                    ? '[hash:base64]'
                    : '[path][name]__[local]',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ttf)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/react-toastify/dist/ReactToastify.css',
            to: 'ReactToastify.css',
          },
          {
            from: 'src/renderer/preload.js',
            to: 'preload.js',
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: 'src/renderer/index.html',
      }),
    ],
  };
};
