const path = require("path");
const webpack = require('webpack');
const awesomeTypescriptLoader = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJson = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';

const extractCss = new ExtractTextPlugin({ filename: `[name].css?v=${packageJson.version}`, allChunks: true });

const pages = [
  {
    name: 'index',
    src: './ui/containers/index.tsx',
    base: '',
  },
  {
    name: 'game',
    src: './ui/containers/game.tsx',
    base: '../../',
  },
  {
    name: 'delete',
    src: './ui/containers/delete.tsx',
    base: '../../',
  },
  {
    name: 'player',
    src: './ui/containers/player.tsx',
    base: '../../',
  },
  {
    name: 'playergames',
    src: './ui/containers/playergames.tsx',
    base: '../../../',
  },
  {
    name: 'headtohead',
    src: './ui/containers/headtohead.tsx',
    base: '../../../',
  },
  {
    name: 'headtoheadgames',
    src: './ui/containers/headtoheadgames.tsx',
    base: '../../../../',
  },
  {
    name: 'historic',
    src: './ui/containers/historic.tsx',
    base: '',
  },
  {
    name: 'speculate',
    src: './ui/containers/speculate.tsx',
    base: '../',
  },
  {
    name: 'stats',
    src: './ui/containers/stats.tsx',
    base: '../',
  },
];

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: pages.reduce((acc,cur) => {
    acc[cur.name] = ['babel-polyfill', cur.src];
    return acc;
  }, {}),
  output: {
    publicPath: 'dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
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
      {test: /\.(jpg|png|gif)$/, loader: 'file-loader', options: { publicPath: './' }},
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
    const links = [];
    if ((new Date()).getMonth() === 11) {
      links.push(`<link href="${page.base}css/christmas.css" rel="stylesheet">`);
    }
    yield new HtmlWebpackPlugin({
      template: 'templates/index.ejs',
      title: '',
      base: page.base,
      links,
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
