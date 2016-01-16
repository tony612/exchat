var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: [
    './client/js/app.js',
    'bootstrap-loader'
  ],
  output: {
    path: './priv/static/js',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel', query: {cacheDirectory: true, presets: ['react', 'es2015', 'stage-2']}},

      // No need for this. jQuery is a global variable
      // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },

      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&mimetype=image/svg+xml'},

      {test: /\.scss$/, loader: 'style!css!sass'}
    ]
  },

  resolve: {
    root: [
      path.join(__dirname, '')
    ],

    extensions: ['', '.js', '.jsx', '.scss']
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]

};
