module.exports = {
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: [
          'node_modules',
          'swagger',
        ],
        options: {
          emitErrors: true,
        },
      },
      {
        test: /\.ts(x?)$/,
        loader: 'awesome-typescript-loader',
        exclude: [
          'node_modules',
          'swagger',
        ],
        options: {
          useCache: true,
          useBabel: true,
          babelCore: "@babel/core",
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devtool: 'inline-source-map',
};
