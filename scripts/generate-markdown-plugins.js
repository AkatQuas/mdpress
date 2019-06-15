const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolveRoot, resolve } = require('./utils');

module.exports = (configs) => {
  const minify = {
    collapseWhitespace: true,
    removeComments: true,
    removeAttributeQuotes: true
  };

  const htmlPlugins = configs.map(config => new HtmlWebpackPlugin({
    filename: config.filename,
    template: resolveRoot('templates', 'index.html'),
    minify,
    templateParameters: {
      title: config.title,
      menu: config.menu,
      content: config.content
    }
  }));
  const copyPlugins = new CopyPlugin(
    configs.map(config => ({
      from: resolve(config.dir, 'static'),
      to: 'static',
      test: /\.(png|jpe?g|svg)$/,
    }))
  );

  return {
    plugins: htmlPlugins.concat(copyPlugins),
  }
}