var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var buildDir = path.resolve(__dirname, './build')
var clientPath = path.resolve(__dirname, './src/client')
var serverPath = path.resolve(__dirname, './src/server')

var clientConfig = {
  entry: clientPath,
  output: {
    filename: 'client.js',
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

var serverConfig = {
  target: 'node',
  entry: serverPath + '/server.js',
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

module.exports = [clientConfig, serverConfig]
