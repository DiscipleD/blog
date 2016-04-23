/**
 * Created by jack on 16-4-16.
 */
import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import 'babel-polyfill';

// Koa application is now a class and requires the new operator.
const app = new Koa();
const PORT = parseInt(process.env.PORT || 8080);
const PUBLICPATH = path.resolve(__dirname, '../public');

import webpack from 'webpack';
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';
import devConfig from '../../webpack.config.js';

if (process.env.NODE_ENV === 'production') {
	// koa static server
	const publicFiles = serve(PUBLICPATH);
	app.use(publicFiles);
} else {
	// koa static server
	// static server should use before webpack middleware
	const publicFiles = serve(PUBLICPATH);
	app.use(publicFiles);

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

// x-response-time
async function responseTime(ctx, next) {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
}

// logger
async function logger() {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log('%s %s - %s', this.method, this.url, ms);
}

app.use(responseTime);
app.use(logger);

app.on('error', function(err){
	log.error('server error', err);
});

app.listen(PORT, () => {
	console.log(`Blog is running, port: ${PORT}`)
});