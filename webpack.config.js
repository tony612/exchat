var path = require('path');
var webpack = require('webpack');
var config = {
  mode: 'production',
  entry: [
    path.resolve(__dirname, './client/js/app.js')
  ],
  output: {
    path: path.resolve(__dirname, './priv/static/js'),
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
	test: /\.jsx?$/,
	use: {
	  loader : 'babel-loader',
	}
      },
      {
	test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
	use: [{
	  loader: 'file-loader',
	  options: {
	    name: '[name].[ext]',
	    mimetype: 'application/font-woff'
	  }
	}]
      },
      {
	test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
	use: [{
	  loader: 'file-loader',
	  options: {
	    name: '[name].[ext]',
	    mimetype: 'application/font-woff'
	  }
	}]
      },
      {
	test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    
	use: [{
	  loader: 'file-loader',
	  options: {
	    name: '[name].[ext]',
	    mimetype: 'application/octet-stream'
	  }
	}]
      },
      {
	test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    
	use: 'file-loader'
      },
      {
	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    
	use: [{
	  loader: 'file-loader',
	  options: {
	    name: '[name].[ext]',
	    limit: '10000',
	    mimetype: 'image/svg+xml'
	  }
	}]
      },
      {
	test: /\.scss$/, 
	loader: 'style-loader!css-loader!sass-loader'
      },
      {
	test: /\.css$/, 
	loader: 'style-loader!css-loader'
      }
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, './client'),
    inline: true,
    open: true
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
}

module.exports = config
