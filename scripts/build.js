const { resolveRoot, fs } = require('./utils');
const { execSync } = require('child_process');
const webpack = require('webpack');
const chalk = require('chalk');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.prod');
const generateMarkdownPlugins = require('./generate-markdown-plugins');
const prepareMarkdownConfig = require('./prepare-markdown-config');

function formatMarkdown() {
  const cmd = [
    'prettier',
    '--write',
    '"src/docs/**/*.md"'
  ].join(' ');
  execSync(cmd);
}

function main() {
  formatMarkdown();
  const DistDir = resolveRoot('dist');
  // read and parse docs
  const htmls = prepareMarkdownConfig();

  // create html plugins from config
  const htmlPlugins = generateMarkdownPlugins(htmls);

  // build
  fs.emptyDirSync(DistDir);

  webpack(merge(baseConfig, htmlPlugins), (err, stats) => {
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }).concat('\n\n'));

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n'
    ));
  });
}

main();
