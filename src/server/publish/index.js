/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 05/03/2017
 */

import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'co-body';

const publishApp = new Koa();
const router = new Router();

const ENDPOINTS_FILE = path.resolve(__dirname, './endpoints.txt');

const addEndpoint = (endpoints, endpoint) => {
	if (endpoints.indexOf(endpoint) === -1) {
		endpoints.push(endpoint);
	}

	return endpoints;
};

const removeEndpoint = (endpoints, endpoint) => {
	const index = endpoints.indexOf(endpoint);
	if (index > -1) {
		endpoints.splice(index, 1);
	}

	return endpoints;
};

const operatorEndpoints = (endpoint, operate) =>
	new Promise((resolve, reject) => {
		fs.open(ENDPOINTS_FILE, 'w+', (err, fd) => {
			if (err) reject(err);

			fs.fstat(fd, (err, stats) => {
				if (err) reject(err);

				const bufferSize = stats.size;
				let buffer = new Buffer(bufferSize);

				fs.read(fd, buffer, 0, bufferSize, 0, (err, bytesRead, buffer) => {
					if (err) reject(err);

					const data = buffer.toString('utf8');
					const endpoints = data.split(',');

					fs.writeSync(fd, operate(endpoints, endpoint).toString(), 0, 'utf8');

					fs.close(fd, resolve);
				});
			});
		});
	});

router
	.post('/subscribe', async ctx => {
		const body = await bodyParser(ctx.request);
		const endpoint = body.endpoint;

		await operatorEndpoints(endpoint, addEndpoint)
			.then(() => {
				ctx.status = 200;
				ctx.body = {};
			})
			.catch(err => {
				ctx.status = 500;
				ctx.body = err;
			});
	})
	.post('/unsubscribe', async ctx => {
		const body = await bodyParser(ctx.request);
		const endpoint = body.endpoint;

		await operatorEndpoints(endpoint, removeEndpoint)
			.then(() => {
				ctx.status = 200;
				ctx.body = {};
			})
			.catch(err => {
				ctx.status = 500;
				ctx.body = err;
			});
	});

publishApp
	.use(router.routes())
	.use(router.allowedMethods());

export default  publishApp;
