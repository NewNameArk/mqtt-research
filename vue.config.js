const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ],
  },
})
