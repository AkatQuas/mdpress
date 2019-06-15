const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { resolveRoot } = require('./utils');

module.exports = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolveRoot('templates', 'template.html'),
      templateParameters: {
        title: 'Development',
      },
      compile:true,
      favicon: false
    }),
  ],
  devServer: {
    host: 'localhost',
    inline: true,
    quiet: true,
    hot: true,
    open: true,
    clientLogLevel: 'warning',
    port: '8021',
    historyApiFallback: true
  },
});