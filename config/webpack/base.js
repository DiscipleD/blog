/**
 * Created by jack on 16-11-27.
 */

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SOURCE_PATH = path.join(__dirname, '../../src');
const PUBLIC_PATH = '/';
const DIST_PATH = path.join(__dirname, '../../build/client');

const webpackConfig = {
	// http://mp.weixin.qq.com/s?__biz=MzI3NTE2NjYxNw==&mid=2650600472&idx=1&sn=d4bf85c1bb26a32aff144e81d652582f
	devtool: 'source-map',
	output: {
		path: DIST_PATH,
		publicPath: PUBLIC_PATH
	},
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.js',
			'assets': SOURCE_PATH + '/client/assets',
			'common': SOURCE_PATH + '/client/common',
			'components': SOURCE_PATH + '/client/components',
			'containers': SOURCE_PATH + '/client/containers',
			'vuexModule': SOURCE_PATH + '/client/vuex/module'
		}
	},
	plugins: [
		// the plugin need be added in loader
		new ExtractTextPlugin('style-[contenthash:8].css'),
		new webpack.NoEmitOnErrorsPlugin()
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				exclude: /node_modules/,
				options: {
					emitWarning: true,
					emitError: true,
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.html$/,
				loader: 'html-loader?interpolate',
				exclude: /node_modules/
			},
			{
				test: /\.(sc|c)ss$/,
				// extract css file from js file, that will reduce the js file size and optimize page loading.
				// but it will increase the package time, so it should be only used in build file.
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader?sourceMap',
						{
							loader: 'postcss-loader?sourceMap',
							options: {
								plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
							}
						},
						'sass-loader'
					]
				})
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'file-loader?hash=sha512&digest=hex&name=[path][name]-[hash:8].[ext]',
					'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff&prefix=fonts'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/octet-stream&prefix=fonts'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
			}
		]
	}
};

module.exports = webpackConfig;
