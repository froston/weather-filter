var webpack = require('webpack')
var path = require('path')

var buildDir = path.resolve(__dirname, 'build')

var config = {
  devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: buildDir,
    pathinfo: true,
  },
  performance: {
    hints: false,
  },
}

module.exports = config