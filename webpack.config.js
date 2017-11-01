var webpack = require('webpack')
var path = require('path')

var buildDir = path.resolve(__dirname, './build')
var appDir = path.resolve(__dirname, './src')

var config = {
  devtool: false,
  bail: true,
  entry: appDir + '/index.js',
  output: {
    filename: 'bundle.js',
    path: buildDir,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ],
  }
}

module.exports = config
