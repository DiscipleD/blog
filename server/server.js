/**
 * Created by jack on 16-4-16.
 */
import 'babel-polyfill';
import path from 'path';
import Koa from 'koa';
import mount from 'koa-mount';
import graphQLHTTP from 'koa-graphql';
import convert from 'koa-convert';
import serve from 'koa-static';

import schema from './graphql'
import * as middleware from './middleware';

// Koa application is now a class and requires the new operator.
const app = new Koa();
const PORT = parseInt(process.env.PORT || 8080);
const PUBLICPATH = path.resolve(__dirname, '../public');

// koa graphql
app.use(mount('/graphql', convert(graphQLHTTP({ schema, pretty: true }))));

// koa static server
// static server should use before webpack middleware
const publicFiles = serve(PUBLICPATH);
app.use(mount('/', publicFiles));

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

app.use(middleware.serverErrorHandler);
app.use(middleware.pageNotFound);
app.use(middleware.responseTime);
app.use(middleware.logger);

app.on('error', function(err){
	console.log('server error', err);
});

app.listen(PORT, () => {
	console.log(`Blog is running, port: ${PORT}`)
});