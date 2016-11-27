/**
 * Created by jack on 16-11-27.
 */

import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import { createRenderer, createBundleRenderer } from 'vue-server-renderer';

const app = new Koa();

const PUBLIC_PATH = path.resolve(__dirname, '../public');
const indexHTML = fs.readFileSync(PUBLIC_PATH + '/index.html', 'utf8');
const render = createBundleRenderer(fs.readFileSync(PUBLIC_PATH + '/server.app.js', 'utf-8'));

const renderServer = async ctx => {
	console.log('~~~~~~~~~~~~~~~~~' + ctx.url + '~~~~~~~~~~~~');
	await new Promise((resolve, reject) => {
		render.renderToString(
			{ url: ctx.url },
			(error, vueApp) => {
				if (error) {
					// server console
					console.error(error);

					// response error message
					ctx.status = 500;
					ctx.body = error;

					reject(error);
				}
				console.log(indexHTML.replace('<div id=app></div>', vueApp));
				ctx.body = indexHTML.replace('<div id=app></div>', vueApp);
				resolve();
			});
	});
};

app.use(renderServer);

export default app;
