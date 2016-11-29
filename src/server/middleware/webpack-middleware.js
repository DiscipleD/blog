/**
 * Created by jack on 16-11-28.
 */

import webpack from 'webpack';
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';
import devConfig from '../../../config/webpack/client';

const compile = webpack(devConfig);

const webpackDevMiddleware = devMiddleware(compile, {
	// display no info to console (only warnings and errors)
	noInfo: false,
	stats: {
		colors: true,
		cached: false
	},
	contentBase: devConfig.output.path,
	publicPath: devConfig.output.publicPath
});

const webpackHotMiddleware = hotMiddleware(compile, {});

export {webpackDevMiddleware, webpackHotMiddleware};
