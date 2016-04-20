/**
 * Created by jack on 16-4-16.
 */
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const SOURCEPATH = path.join(__dirname, 'client/app');
const DISTPATH = path.join(SOURCEPATH, 'dist/client');

module.exports = {
	devtool: 'source-map',
	entry: [
		'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&timeout=20000',
		'./client/app/app.js'],
	output: {
		filename: 'bundle.js',
		path: DISTPATH,
		publicPath: '/client/'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
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
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: SOURCEPATH
			}
		],

		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				exclude: /node_modules/,
				include: SOURCEPATH
			},
			/* {
				test: /(\.tpl|template)\.html$/,
				loader: 'html',
				query: {interpolate: true},
				exclude: /node_modules/,
				include: SOURCEPATH
			},*/
			{
				test: /\.html$/,
				loader: 'file?name=[path][name]-[hash:8].[ext]',
				exclude: /node_modules/,
				include: SOURCEPATH
			},
			{
				test: /\.(sc|c)ss$/,
				loader: ['style', 'css', 'postcss', 'sass']
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