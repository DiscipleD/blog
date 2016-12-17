/**
 * Created by jack on 16-11-27.
 */

import fs from 'fs';
import path from 'path';
import { createBundleRenderer } from 'vue-server-renderer';
import serialize from 'serialize-javascript';

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

const generatorHtml = (str, pageTitle, initState) => {
	indexHTML = indexHTML.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
	const [header, footer] = indexHTML.split('<blog></blog>');
	// Fix XSS Vulnerability by SSR init state.
	// Ref: https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0
	return `${header}${str}<script>window.__INITIAL_STATE__=${serialize(initState, { isJSON: true })}</script>${footer}`;
};

const renderServer = async ctx => {
	const context = { url: ctx.url };
	// Have to create a promise, because koa don't wait for render callback
	await new Promise((resolve, reject) => {
		renderer.renderToString(
			context,
			(error, vueApp) => {
				if (error) {
					if (error.code === '404') {
						ctx.status = 404;
					} else {
						reject(error);
					}
				} else {
					ctx.type = 'text/html';
					ctx.body = generatorHtml(vueApp, context.pageTitle, context.initialState);
				}
				resolve();
			});
	});
};

export default renderServer;
