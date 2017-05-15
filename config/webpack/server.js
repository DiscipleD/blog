/**
 * Created by jack on 16-11-27.
 */
const webpack = require('webpack');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const PATH = require('./setting');
const baseWebpackConfig = require('./base');

const webpackConfig = Object.assign({}, baseWebpackConfig, {
	target: 'node',
	entry: PATH.SOURCE_PATH + '/server-entry.js',
	output: Object.assign({}, baseWebpackConfig.output, {
		filename: 'server.bundle.js',
		libraryTarget: 'commonjs2'
	}),
	externals: Object.keys(require(PATH.ROOT + 'package.json').dependencies),
	// VueSSRServerPlugin work fail with webpack-middleware
	plugins: baseWebpackConfig.plugins.concat([
		new VueSSRServerPlugin()
	])
});

module.exports = webpackConfig;
