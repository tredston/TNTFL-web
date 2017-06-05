var path = require("path");
var webpack = require('webpack');
const awesomeTypescriptLoader = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJson = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';

const pages = [
  {
    name: 'index',
    src: './ui/containers/index.tsx',
    base: '',
    links: ['<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/2.5.5/react-bootstrap-table.min.css" integrity="sha384-VIXf7ijRNoaapcQEvARxuDSoSqHwZOTEXGpFw8r1dZ6PC0s3vOFhYUrOHO7SQRUl" crossorigin="anonymous">'],
  },
  {
    name: 'game',
    src: './ui/containers/game.tsx',
    base: '../../',
    links: [],
  },
  {
    name: 'delete',
    src: './ui/containers/delete.tsx',
    base: '../../',
    links: [],
  },
  {
    name: 'player',
    src: './ui/containers/player.tsx',
    base: '../../',
    links: ['<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/2.5.5/react-bootstrap-table.min.css" integrity="sha384-VIXf7ijRNoaapcQEvARxuDSoSqHwZOTEXGpFw8r1dZ6PC0s3vOFhYUrOHO7SQRUl" crossorigin="anonymous">'],
  },
  {
    name: 'playergames',
    src: './ui/containers/playergames.tsx',
    base: '../../../',
    links: [],
  },
  {
    name: 'headtohead',
    src: './ui/containers/headtohead.tsx',
    base: '../../../',
    links: [],
  },
  {
    name: 'headtoheadgames',
    src: './ui/containers/headtoheadgames.tsx',
    base: '../../../../',
    links: [],
  },
  {
    name: 'historic',
    src: './ui/containers/historic.tsx',
    base: '',
    links: [
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/2.5.5/react-bootstrap-table.min.css" integrity="sha384-VIXf7ijRNoaapcQEvARxuDSoSqHwZOTEXGpFw8r1dZ6PC0s3vOFhYUrOHO7SQRUl" crossorigin="anonymous">',
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.1.5/css/ion.rangeSlider.min.css" integrity="sha384-Wq9DAJUP5kU9Dk244QvEHs3ZXLGzxXxwU338D+D+czP5fUSWkRoF6VhjUPnMk6if" crossorigin="anonymous">',
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.1.5/css/ion.rangeSlider.skinModern.min.css" integrity="sha384-7BZOVCgNHI0de9biH6OtG+p+ZGvcyLZTF2OyorTMm705uvbI1iWwxF2qUvGFrVNY" crossorigin="anonymous">',
    ],
  },
  {
    name: 'speculate',
    src: './ui/containers/speculate.tsx',
    base: '../',
    links: ['<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/2.5.5/react-bootstrap-table.min.css" integrity="sha384-VIXf7ijRNoaapcQEvARxuDSoSqHwZOTEXGpFw8r1dZ6PC0s3vOFhYUrOHO7SQRUl" crossorigin="anonymous">'],
  },
  {
    name: 'stats',
    src: './ui/containers/stats.tsx',
    base: '../',
    links: [],
  },
];

module.exports = {
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
  for (var page of pages) {
    const links = page.links;
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
    yield new webpack.optimize.UglifyJsPlugin();
  }
  else {
    yield new awesomeTypescriptLoader.CheckerPlugin();
    yield new webpack.NoEmitOnErrorsPlugin();
  }
}
