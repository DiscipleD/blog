/**
 * Created by jack on 16-11-27.
 */
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SOURCE_PATH = path.join(__dirname, '../../src');

const webpackConfig = {
	// http://mp.weixin.qq.com/s?__biz=MzI3NTE2NjYxNw==&mid=2650600472&idx=1&sn=d4bf85c1bb26a32aff144e81d652582f
	devtool: 'source-map',
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.js',
			'assets': SOURCE_PATH + '/client/assets',
			'common': SOURCE_PATH + '/client/common',
			'components': SOURCE_PATH + '/client/components',
			'containers': SOURCE_PATH + '/client/containers'
		},
		extensions: ['', '.js']
	},
	eslint: {
		configFile: '.eslintrc',
		emitWarning: true,
		emitError: true,
		formatter: require('eslint-friendly-formatter')
	},
	postcss: [autoprefixer({browsers: ['last 2 versions']})],
	plugins: [
		// the plugin need be added in loader
		new ExtractTextPlugin('style-[contenthash:8].css'),
		new webpack.NoErrorsPlugin()
	],
	module: {
		preLoaders: [
			{
				test: /[^(\.min)]\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: SOURCE_PATH
			}
		],
		loaders: [
			{
				test: /[^(\.min)]\.js$/,
				loaders: ['babel'],
				exclude: /node_modules/,
				include: SOURCE_PATH
			},
			{
				test: /\.html$/,
				loader: 'html',
				query: {interpolate: true},
				exclude: /node_modules/,
				include: SOURCE_PATH
			},
			{
				test: /\.(sc|c)ss$/,
				// extract css file from js file, that will reduce the js file size and optimize page loading.
				// but it will increase the package time, so it should be only used in build file.
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
				// loaders: ['style', 'css', 'postcss', 'sass']
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
			}
		]
	}
};

module.exports = webpackConfig;
