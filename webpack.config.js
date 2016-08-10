/**
 * Created by jack on 16-4-16.
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SOURCEPATH = path.join(__dirname, 'client');
const DISTPATH = path.join(__dirname, 'build/public');

const defaultWebpackConfig = {
	devtool: 'source-map',
	entry: {
		common: ['vue', 'vue-router'],
		main: [SOURCEPATH + '/app/app.js']
	},
	output: {
		filename: '[name].[hash:8].js',
		path: DISTPATH,
		publicPath: '/',
		// The JSONP function used by webpack for asnyc loading of chunks.
		// Must Using different identifier, when having multiple webpack instances on a single page.
		// If not, that will cause reference error.
		jsonpFunction: 'blogJsonp'
	},
	// externals can be used when sources loaded by other project or remote system, like CDN.
	externals: {
		"jQuery": "jQuery" // externals key which is used by import, value which is used mapping global value
		// can't set this attribute for dynamic require, because the source file load in asynchronous way
		// however webpack dynamic require need a exist lib
		// so add this attr in .eslintrc file treated it as a global value
		// "DISQUS": "DISQUS"
	},
	plugins: [
		// Common Chunk Plugin should be used when project has several entries for common lib file.
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			filename: 'common.[hash:8].js'
		}),
		/*
		 * DllReferencePlugin is used to package project library file, which will not be compile every time.
		 * That plugin will improve local build efficiency.
		 * But that cause another problem that file can't be automatically injected into index.html.
		 * That problem causes the plugin is useless.
		new webpack.DllReferencePlugin({
			context: path.join(__dirname),
			manifest: require(DISTPATH + '/VueStuff.manifest.json')
		}),*/
		// webpack-dev-middleware doesn't create any file, but it will write file in memory, that will cause good performance
		// write the right path, webpack-dev-middleware server can reach it
		new HtmlWebpackPlugin({
			template: SOURCEPATH + '/index.html'
		}),
		// create another 404.html file
		new HtmlWebpackPlugin({
			filename: '404.html',
			template: SOURCEPATH + '/404.html',
			inject: false
		}),
		// the plugin need be added in loader
		new ExtractTextPlugin('style-[contenthash:8].css')
	],
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.js'
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

let webpackConfig = Object.assign({}, defaultWebpackConfig);

if (process.env.NODE_ENV === 'production') {
	webpackConfig.plugins.unshift(new CleanPlugin([DISTPATH]));
	webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
	webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}));
} else {
	webpackConfig.entry['main'].unshift('webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&timeout=20000');
	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

webpackConfig.plugins.push(new webpack.NoErrorsPlugin());

module.exports = webpackConfig;
