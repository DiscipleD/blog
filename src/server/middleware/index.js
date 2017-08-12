/**
 * Created by jack on 16-8-22.
 */

import path from 'path';

import { readFile } from '../common/DataService';
import serverRender from './server-render';

let _404HTML;
readFile(path.join(__dirname, '../../404.html')).then(buffer => { _404HTML = buffer.toString(); });

// server error catcher
const serverErrorHandler = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		err.status = err.statusCode || err.status || 500;
		throw err;
	}
};

// 404 handler
const pageNotFound = async (ctx, next) => {
	await next();

	if (404 != ctx.status) return;

	// we need to explicitly set 404 here
	// so that koa doesn't assign 200 on body=
	ctx.status = 404;

	switch (ctx.accepts('html', 'json')) {
		case 'html':
			ctx.type = 'text/html';
			ctx.body = _404HTML;
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
};

// x-response-time
const responseTime = async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
};

// logger
const logger = async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log('%s %s - %s', ctx.method, ctx.url, `${ms}ms`);
};

export {serverRender, serverErrorHandler, pageNotFound, responseTime, logger};
