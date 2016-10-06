var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCssPlugin = new ExtractTextPlugin('[name].css', { allChunks: true });

module.exports = {
  entry: {
    game: './ui/game.tsx'
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
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.css$/, loader: extractCssPlugin.extract('style-loader', 'css-loader?minimize') },
    ]
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    extractCssPlugin
  ]
};
