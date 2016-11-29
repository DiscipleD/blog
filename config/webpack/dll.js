/**
 * Created by jack on 16-8-3.
 */

const path = require('path');
const webpack = require('webpack');

const DIST_PATH = path.join(__dirname, '../../build/client');

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
		path: DIST_PATH,
		library: '[name]_library'
	},

	plugins: [
		new webpack.DllPlugin({
			name: '[name]_library',
			path: DIST_PATH + '/[name].manifest.json'
		})
	]
};
