/**
 * Created by jack on 16-11-27.
 */
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SOURCEPATH = path.join(__dirname, 'client');
const DISTPATH = path.join(__dirname, 'build/public');

const webpackConfig = {
	target: 'node',
	entry: {
		app: SOURCEPATH + '/server-entry.js'
	},
	output: {
		filename: 'server.[name].js',
		path: DISTPATH,
		libraryTarget: 'commonjs2'
	},
	// externals can be used when sources loaded by other project or remote system, like CDN.
	externals: Object.keys(require('./package.json').dependencies),
	plugins: [
		// the plugin need be added in loader
		new ExtractTextPlugin('style-[contenthash:8].css'),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.js',
			'assets': SOURCEPATH + '/assets',
			'common': SOURCEPATH + '/common',
			'components': SOURCEPATH + '/components',
			'containers': SOURCEPATH + '/containers'
		},
		extensions: ['', '.js']
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
				loader: "html!markdown"
			},
			/*{
			 test: /\.html$/,
			 loader: 'file?name=[path][name]-[hash:8].[ext]',
			 exclude: /node_modules/,
			 include: SOURCEPATH
			 },*/
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
