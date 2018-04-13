var webpack = require('webpack')
var path = require('path')

var buildDir = path.resolve(__dirname, './build')
var appDir = path.resolve(__dirname, './src/server')

var config = {
  target: 'node',
  entry: appDir + '/server.js',
  output: {
    filename: 'server.js',
    path: buildDir,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'production'`,
      }
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
