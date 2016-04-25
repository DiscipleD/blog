/**
 * Created by jack on 16-4-16.
 */
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const SOURCEPATH = path.join(__dirname, 'client');
const DISTPATH = path.join(__dirname, 'dist/public');

module.exports = {
	devtool: 'source-map',
	entry: [
		'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&timeout=20000',
		SOURCEPATH + '/app/app.js'
	],
	output: {
		filename: '[name].[hash].js',
		path: DISTPATH,
		publicPath: '/'
	},
	// externals can be used when sources loaded by other project or remote system, like CDN.
	externals: {
		"jQuery": "jQuery" // externals key which is used by import, value which is used mapping global value
	},
	plugins: [
		new CleanPlugin([DISTPATH]),
		new webpack.optimize.OccurenceOrderPlugin(),
		// webpack-dev-middleware doesn't create any file, but it will write file in memory, that will cause good performance
		// write the right path, webpack-dev-middleware server can reach it
		new HtmlWebpackPlugin({
			template: SOURCEPATH + '/index.html'
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		extensions: ['', '.js']
	},
	eslint: {
		configFile: '.eslintrc',
		emitWarning: true,
		emitError: true,
		formatter: require('eslint-friendly-formatter')
	},
	postcss: [autoprefixer({browsers: ['last 2 versions']})],
	module: {
		preLoaders: [
			{
				test: /[^(\.min)]\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: SOURCEPATH
			}
		],

		loaders: [
			{
				test: /[^(\.min)]\.js$/,
				loaders: ['babel'],
				exclude: /node_modules/,
				include: SOURCEPATH
			},
			{
				test: /\.html$/,
				loader: 'html',
				query: {interpolate: true},
				exclude: /node_modules/,
				include: SOURCEPATH
			},
			{
				test: /\.md$/,
				loader: "html!markdown?breaks=true&pedantic=true&smartypants=true"
			},
			/*{
				test: /\.html$/,
				loader: 'file?name=[path][name]-[hash:8].[ext]',
				exclude: /node_modules/,
				include: SOURCEPATH
			},*/
			{
				test: /\.(sc|c)ss$/,
				loaders: ['style', 'css', 'postcss', 'sass']
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[path][name]-[hash:8].[ext]',
					'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff&prefix=fonts'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/octet-stream&prefix=fonts'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=image/svg+xml&prefix=fonts'
			}

		]
	}
};