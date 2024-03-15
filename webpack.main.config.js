const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    mode: isProduction
      ? 'production'
      : 'development',
    entry: './src/main/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'webpack-dist'),
      publicPath: '/',
    },
    target: 'electron-main',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    node: {
      __dirname: true,
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.tsx?$/u,
          use: 'ts-loader',
          exclude: /node_modules/u,
        },
      ],
    },
  };
};
