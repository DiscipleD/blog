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

// koa static server
// static server should use before webpack middleware
const publicFiles = serve(PUBLICPATH);
app.use(publicFiles);

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

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		err.status = err.statusCode || err.status || 500;
		throw err;
	}
});

// 404 handler
async function pageNotFound(ctx, next) {
	await next();

	if (404 != ctx.status) return;

	// we need to explicitly set 404 here
	// so that koa doesn't assign 200 on body=
	ctx.status = 404;

	switch (ctx.accepts('html', 'json')) {
		case 'html':
			ctx.response.redirect('/404.html');
			break;
		case 'json':
			ctx.body = {
				message: 'Page Not Found'
			};
			break;
		default:
			ctx.type = 'text';
			ctx.body = 'Page Not Found';
	}
}

// x-response-time
async function responseTime(ctx, next) {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
}

// logger
async function logger(ctx, next) {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log('%s %s - %s', ctx.method, ctx.url, `${ms}ms`);
}

app.use(pageNotFound);
app.use(responseTime);
app.use(logger);

app.on('error', function(err){
	console.log('server error', err);
});

app.listen(PORT, () => {
	console.log(`Blog is running, port: ${PORT}`)
});