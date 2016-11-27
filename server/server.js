/**
 * Created by jack on 16-4-16.
 */
import 'babel-polyfill';

import Koa from 'koa';
import mount from 'koa-mount';
import graphQLHTTP from 'koa-graphql';
import convert from 'koa-convert';
import rewrite from 'koa-rewrite';

import schema from './graphql'
import serverRender from './server-render';
import staticServer from './staticServer';
import * as middleware from './middleware';

const app = new Koa();
const PORT = parseInt(process.env.PORT || 8080);

app.use(middleware.serverErrorHandler);
app.use(middleware.pageNotFound);
app.use(middleware.responseTime);
app.use(middleware.logger);

// koa graphql
app.use(mount('/graphql', convert(graphQLHTTP({ schema, pretty: true }))));

// koa static
app.use(mount('/', staticServer));

// server app
app.use(mount('/', serverRender));

app.on('error', function(err){
	console.log('server error', err);
});

app.listen(PORT, () => {
	console.log(`Blog is running, port: ${PORT}`)
});