var path = require('path')
var webpack = require('webpack')

var config = {
  entry: [
    './client/js/app.js'
  ],
  output: {
    path: './priv/static/js',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel',
        query: {
          cacheDirectory: true, presets: ['react', 'es2015', 'stage-2'],
          plugins: ['transform-function-bind']
        }
      },

      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?&mimetype=application/font-woff'},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: 'url?&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&mimetype=image/svg+xml'},

      {test: /\.scss$/, loader: 'style!css!sass'},
      {test: /\.css$/, loader: 'style!css'}
    ]
  },

  resolve: {
    root: [
      path.join(__dirname, '')
    ],

    extensions: ['', '.js', '.jsx', '.scss', '.css']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ]

}

module.exports = config
