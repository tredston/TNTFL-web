const path = require("path");
const webpack = require('webpack');
const awesomeTypescriptLoader = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJson = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';

const extractCss = new ExtractTextPlugin({ filename: `[name].css?v=${packageJson.version}`, allChunks: true });

function getPages() {
  const pageDepths = {
    0: ['index', 'historic'],
    1: ['speculate', 'stats'],
    2: ['game', 'delete', 'player'],
    3: ['headtohead', 'playergames'],
    4: ['headtoheadgames'],
  };
  const expanded = Object.keys(pageDepths).map(k => pageDepths[k].map(p => ({
    name: p,
    src: [`./ui/path/path${k}.ts`, `./ui/containers/${p}.tsx`],
    base: `${'../'.repeat(k)}dist/`,
  })));
  return [].concat.apply([], expanded);
}
const pages = getPages();

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: pages.reduce((acc,cur) => {
    acc[cur.name] = ['babel-polyfill', ...cur.src];
    return acc;
  }, {}),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `[name]-bundle?v=${packageJson.version}.js`,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.less', '.css'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: [
          'node_modules',
          'swagger',
        ],
        loaders: 'tslint-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: [
          'node_modules',
          'swagger',
        ],
        use: { loader: 'awesome-typescript-loader', options: { useCache: true, useBabel: true } },
      },
      {test: /\.css$/, loader: extractCss.extract({fallback: 'style-loader', use: 'css-loader?minimize'})},
      {test: /\.less$/, loader: extractCss.extract({fallback: 'style-loader', use: 'css-loader?minimize!less-loader'})},
      {test: /\.(jpg|png|gif)$/, loader: 'file-loader', options: { name: '[name].[ext]', useRelativePath: true }},
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [...plugins()],
};

function* plugins() {
  yield new webpack.optimize.ModuleConcatenationPlugin();
  yield extractCss;
  for (var page of pages) {
    yield new HtmlWebpackPlugin({
      template: 'templates/index.ejs',
      title: '',
      base: page.base,
      appVersion: `${packageJson.version}`,
      inject: false,
      chunks: ['commons-chunk', page.name],
      filename: `./${page.name}.html`,
    });
  }
  if (isProd) {
    yield new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } });
  }
  else {
    yield new awesomeTypescriptLoader.CheckerPlugin();
    yield new webpack.NoEmitOnErrorsPlugin();
  }
}
