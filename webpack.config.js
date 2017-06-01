var path = require("path");
var webpack = require('webpack');
const awesomeTypescriptLoader = require('awesome-typescript-loader');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    index: ['babel-polyfill', './ui/containers/index.tsx'],
    game: ['babel-polyfill', './ui/containers/game.tsx'],
    player: ['babel-polyfill', './ui/containers/player.tsx'],
    headtohead: ['babel-polyfill', './ui/containers/headtohead.tsx'],
    historic: ['babel-polyfill', './ui/containers/historic.tsx'],
    speculate: ['babel-polyfill', './ui/containers/speculate.tsx'],
    stats: ['babel-polyfill', './ui/containers/stats.tsx'],
    playergames: ['babel-polyfill', './ui/containers/playergames.tsx'],
    headtoheadgames: ['babel-polyfill', './ui/containers/headtoheadgames.tsx'],
    delete: ['babel-polyfill', './ui/containers/delete.tsx'],
  },
  output: {
    publicPath: '/',
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
          "node_modules",
        ],
        loaders: 'tslint-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: [
          "node_modules",
        ],
        use: { loader: 'awesome-typescript-loader', options: { useCache: true, useBabel: true } },
      },
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
  yield new webpack.optimize.CommonsChunkPlugin("commons-chunk");
  if (isProd) {
    yield new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } });
    yield new webpack.optimize.UglifyJsPlugin();
  }
  else {
    yield new awesomeTypescriptLoader.CheckerPlugin();
    yield new webpack.NoEmitOnErrorsPlugin();
  }
}
