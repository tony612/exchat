var path = require('path');

module.exports = {
  entry: './web/static/js/app.js',
  output: {
    path: './priv/static/js',
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },

  resolve: {
    root:[
      path.join(__dirname, '')
    ],

    extensions: ['', '.js']
  }

};
