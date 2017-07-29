const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    require: path.resolve(__dirname, './dist/require.js')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './build/')
  },
  devServer: {
    contentBase: path.resolve(__dirname, './build/'),
    port: 8080
  }
}

module.exports = config;