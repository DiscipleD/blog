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
import serverRender from './server-render';
import * as middleware from './middleware';

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

// koa static
app.use(staticServer);

// server render
app.use(mount('/', serverRender));

// WebpackMiddleware have to add at the end of all middleware
if (process.env.NODE_ENV !== 'production') {
	app.use(middleware.webpackDevMiddleware);
	app.use(middleware.webpackHotMiddleware);
}

app.on('error', function(err){
	console.log('server error', err);
});

app.listen(PORT, () => {
	console.log(`Blog is running, port: ${PORT}`)
});
