/**
 * Created by jack on 16-11-27.
 */
const path = require('path');
const webpack = require('webpack');

const baseWebpackConfig = require('./base');
const ROOT = path.join(__dirname, '../../');
const SOURCE_PATH = ROOT + 'src';
const DIST_PATH = ROOT + 'build/client';

const webpackConfig = Object.assign({}, baseWebpackConfig, {
	devtool: false,
	target: 'node',
	entry: {
		app: SOURCE_PATH + '/server-entry.js'
	},
	output: {
		filename: 'server.[name].js',
		path: DIST_PATH,
		libraryTarget: 'commonjs2'
	},
	externals: Object.keys(require(ROOT + 'package.json').dependencies),
	plugins: baseWebpackConfig.plugins.concat([
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		}),
	]),
});

module.exports = webpackConfig;
