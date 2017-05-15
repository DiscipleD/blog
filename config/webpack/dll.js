/**
 * Created by jack on 16-8-3.
 */

const webpack = require('webpack');

const PATH = require('config/webpack/setting');

module.exports = {
	entry: {
		'VueStuff': [
			'vue',
			'vue-router',
			'vuex'
		]
	},
	output: {
		filename: '[name].[hash:8].dll.js',
		path: PATH.DIST_PATH,
		library: '[name]_library'
	},

	plugins: [
		new webpack.DllPlugin({
			name: '[name]_library',
			path: PATH.DIST_PATH + '/[name].manifest.json'
		})
	]
};
