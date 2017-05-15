/**
 * Created by jack on 16-11-27.
 */

import fs from 'fs';
import path from 'path';
import { createBundleRenderer } from 'vue-server-renderer';
import LRU from 'lru-cache';

import { indexTemplatePath, clientManifestFileName, serverBundleFileName } from '../../../config/webpack/setting';
import serverConfig from '../../../config/webpack/server';

const template = fs.readFileSync(indexTemplatePath, 'utf8');
let renderer;

export const createRenderer = (bundle, options = {}) => {
	renderer = createBundleRenderer(bundle, Object.assign({
		template,
		cache: LRU({
			max: 1000
		}),
		runInNewContext: false
	}, options));
};

if (process.env.NODE_ENV === 'production') {
	const serverBundlePath = path.join(serverConfig.output.path, serverBundleFileName);
	createRenderer(require(serverBundlePath), {
		clientManifest: require(`${serverConfig.output.path}/${clientManifestFileName}`),
	});
}

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
					ctx.body = vueApp;
				}
				resolve();
			});
	});
};

export default renderServer;
