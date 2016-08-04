/**
 * Created by jack on 16-8-3.
 */

const path = require('path');
const webpack = require('webpack');

const DISTPATH = path.join(__dirname, 'build/public');

module.exports = {
	entry: {
		'VueStuff': [
			'vue',
			'vue-router'
		]
	},
	output: {
		filename: '[name].[hash:8].dll.js',
		path: DISTPATH,
		library: '[name]_library'
	},

	plugins: [
		new webpack.DllPlugin({
			name: '[name]_library',
			path: DISTPATH + '/[name].manifest.json'
		})
	]
};
