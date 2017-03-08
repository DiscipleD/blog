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
import webPush from 'web-push';

const publishApp = new Koa();
const router = new Router();

const SUBSCRIPTION_FILE = path.resolve(__dirname, './subscriptions.txt');

const getSubscriptionFromString = string => string.split('\n').filter(item => !!item).map(item => JSON.parse(item));
const addSubscription = (subscriptions, subscription) => {
	if (!subscriptions.find(item => item.endpoint === subscription.endpoint)) {
		subscriptions.push(subscription);
	}

	return subscriptions;
};

const removeSubscription = (subscriptions, subscription) => {
	const index = subscriptions.findIndex(item => item.endpoint === subscription.endpoint);
	if (index > -1) {
		subscriptions.splice(index, 1);
	}

	return subscriptions;
};

const operatorSubscription = (subscription, operate) =>
	new Promise((resolve, reject) => {
		fs.open(SUBSCRIPTION_FILE, 'w+', (err, fd) => {
			if (err) reject(err);

			fs.fstat(fd, (err, stats) => {
				if (err) reject(err);

				const bufferSize = stats.size;
				let buffer = new Buffer(bufferSize);

				fs.read(fd, buffer, 0, bufferSize, 0, (err, bytesRead, buffer) => {
					if (err) reject(err);

					const string = buffer.toString('utf8');
					const subscriptions = operate(getSubscriptionFromString(string), subscription);

					fs.writeSync(fd, subscriptions.map(item => JSON.stringify(item)).join('\n'), 0, 'utf8');

					fs.close(fd, resolve);
				});
			});
		});
	});

const readSubscriptions = () =>
	new Promise((resolve, reject) => {
		fs.readFile(SUBSCRIPTION_FILE, (err, buffer) => {
			if (err) reject(err);

			const string = buffer.toString();
			const subscriptions = getSubscriptionFromString(string);

			resolve(subscriptions);
		});
	});

router
	.post('/subscribe', async ctx => {
		const body = await bodyParser(ctx.request);

		await operatorSubscription(body, addSubscription)
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

		await operatorSubscription(body, removeSubscription)
			.then(() => {
				ctx.status = 200;
				ctx.body = {};
			})
			.catch(err => {
				ctx.status = 500;
				ctx.body = err;
			});
	})
	.post('/broadcast', async ctx => {
		const body = await bodyParser(ctx.request);

		await readSubscriptions()
			.then(subscriptions => {
				ctx.status = 200;
				ctx.body = {};

				subscriptions.forEach(subscription => {
					webPush.sendNotification(subscription, JSON.stringify(body))
						.catch(console.error);
				});
			})
			.catch(err => {
				ctx.status = 500;
				ctx.body = err;
			});
	});

publishApp
	.use(router.routes())
	.use(router.allowedMethods());

export default publishApp;
