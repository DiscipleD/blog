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

import * as middleware from './middleware';
import schema from './graphql';
import publish from './publish';

const app = new Koa();

const PORT = parseInt(process.env.PORT || 8080);
const PUBLIC_PATH = path.resolve(__dirname, '../client');
const staticServer = serve(PUBLIC_PATH);

app.use(middleware.serverErrorHandler);
app.use(middleware.pageNotFound);
app.use(middleware.responseTime);
app.use(middleware.logger);

// koa graphql
app.use(mount('/graphql', convert(graphQLHTTP({ schema, pretty: true }))));

// Publish service
app.use(mount('/publish', publish));

if (process.env.NODE_ENV !== 'production') {
	// koa static
	app.use(staticServer);

	const devMiddleware = require('./middleware/webpack-middleware').devMiddleware;
	const hotMiddleware = require('./middleware/webpack-middleware').hotMiddleware;

	app.use(devMiddleware);
	app.use(hotMiddleware);
}

// server render
app.use(middleware.serverRender);

app.on('error', function(err){
	console.log('server error', err);
});

app.listen(PORT, () => {
	console.log(`Blog is running, port: ${PORT}`)
});
