const webpack = require('webpack');

module.exports = {
  devServer: {
    hot: true
  },
  entry: [
    './app/scripts/app.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3001/'
  ],
  output: {
    filename: 'main.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel?cacheDirectory'
    }]
  },
  watch: true,
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    //   output: {
    //     comments: false,
    //   },
    // })
  ]
}
