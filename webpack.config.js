var path = require("path");
var webpack = require('webpack');

module.exports = {
  entry: {
    index: ['babel-polyfill', './ui/index.tsx'],
    game: ['babel-polyfill', './ui/game.tsx'],
    player: ['babel-polyfill', './ui/player.tsx'],
    headtohead: ['babel-polyfill', './ui/headtohead.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css']
  },
  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json-loader'},
    ],
    loaders: [
      { test: /\.tsx?$/, loader: 'babel-loader?presets[]=es2015&presets[]=react!ts-loader', exclude: /node_modules/},
      { test: /\.js$/, loader: 'babel', query: { presets: ['es2015', 'react']}, exclude: /node_modules/},
    ]
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("commons.chunk.js"),
    new webpack.optimize.UglifyJsPlugin({compress:{warnings: false}}),
  ]
};
