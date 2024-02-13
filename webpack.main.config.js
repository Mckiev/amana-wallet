const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    mode: isProduction
      ? 'production'
      : 'development',
    entry: './src/main/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    target: 'electron-main',
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
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
    ],
  };
};
