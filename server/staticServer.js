/**
 * Created by jack on 16-8-27.
 */

import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';

const app = new Koa();

const PUBLICPATH = path.resolve(__dirname, '../public');

// koa static server
// static server should use before webpack middleware
const staticServer = serve(PUBLICPATH);
app.use(staticServer);

import webpack from 'webpack';
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';
import devConfig from '../../webpack.config.js';

// the middleware not work with 404 handler
if (process.env.NODE_ENV !== 'production') {
	// import modules should be in dynamic way
	// System.import support dynamic import file, not support import module now
	// update later
	// System.import('');

	const compile = webpack(devConfig);
	app.use(devMiddleware(compile, {
		// display no info to console (only warnings and errors)
		noInfo: false,
		stats: {
			colors: true,
			cached: false
		},
		contentBase: devConfig.output.path,
		publicPath: devConfig.output.publicPath
	}));
	app.use(hotMiddleware(compile, {}));
}

export default app;
