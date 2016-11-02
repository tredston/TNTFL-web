var path = require("path");
var webpack = require('webpack');

module.exports = {
  entry: {
    index: './ui/index.tsx',
    game: './ui/game.tsx',
    player: './ui/player.tsx',
    headtohead: './ui/headtohead.tsx'
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
      { test: /\.tsx?$/, loader: 'ts-loader'}
    ]
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("commons.chunk.js")
    // new webpack.optimize.UglifyJsPlugin({compress:{warnings: false}})
  ]
};
