let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './demo/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      chunks: false,
      children: false
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      { test: /\.scss$/, loader: 'style!css!sass' },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/index.html', // Load a custom template
      inject: 'body' // Inject all scripts into the body
    })
  ]
}
