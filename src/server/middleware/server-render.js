/**
 * Created by jack on 16-11-27.
 */

import fs from 'fs';
import path from 'path';
import { createBundleRenderer } from 'vue-server-renderer';

import serverConfig from '../../../config/webpack/server';

const serverBundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);

let indexHTML;
let renderer;

export const createIndexHTML = html => {
	indexHTML = html;
};

export const createRenderer = bundle => {
	renderer = createBundleRenderer(bundle);
};

if (process.env.NODE_ENV === 'production') {
	indexHTML = fs.readFileSync(serverConfig.output.path + '/index.temp.html', 'utf8');
	createRenderer(fs.readFileSync(serverBundlePath, 'utf-8'));
}

const generatorHtml = (str, initState) => {
	const [header, footer] = indexHTML.split('<blog></blog>');
	return `${header}${str}<script>window.__INITIAL_STATE__=${JSON.stringify(initState)}</script>${footer}`;
};

const renderServer = async ctx => {
	// Have to create a promise, because koa don't wait for render callback
	await new Promise((resolve, reject) => {
		const context = { url: ctx.url };
		renderer.renderToString(
			context,
			(error, vueApp) => {
				if (error) {
					// server console
					console.error(error);

					// response error message
					ctx.status = 500;
					ctx.body = error;

					reject(error);
				}
				console.log(ctx.path);
				ctx.body = generatorHtml(vueApp, context.initialState);
				resolve();
			});
	});
};

export default renderServer;
