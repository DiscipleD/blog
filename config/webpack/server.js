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
	entry: SOURCE_PATH + '/server-entry.js',
	output: {
		filename: 'server.bundle.js',
		path: DIST_PATH,
		libraryTarget: 'commonjs2'
	},
	externals: Object.keys(require(ROOT + 'package.json').dependencies),
});

module.exports = webpackConfig;
