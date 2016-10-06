var path = require("path");

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
    ]
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
