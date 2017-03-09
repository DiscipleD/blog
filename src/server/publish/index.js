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

const parseSubscriptions = string => string.split('\n').filter(item => !!item).map(item => JSON.parse(item));
const stringifySubscriptions = subscriptions => subscriptions.map(item => JSON.stringify(item)).join('\n');

const readSubscriptions = () =>
	new Promise((resolve, reject) => {
		fs.readFile(SUBSCRIPTION_FILE, 'utf8', (err, buffer) => {
			if (err) reject(err);

			const string = buffer.toString();
			const subscriptions = parseSubscriptions(string);

			resolve(subscriptions);
		});
	});

const writeSubscription = subscriptions =>
	new Promise((resolve, reject) => {
		fs.writeFile(SUBSCRIPTION_FILE, stringifySubscriptions(subscriptions), 'utf8', err => {
			if (err) reject(err);

			resolve();
		});
	});

const addSubscription = subscription =>
	readSubscriptions()
		.then(subscriptions => {
			if (!subscriptions.find(item => item.endpoint === subscription.endpoint)) {
				subscriptions.push(subscription);
			}
			return subscriptions;
		})
		.then(writeSubscription);

const removeSubscription = subscription =>
	readSubscriptions()
		.then(subscriptions => {
			const index = subscriptions.findIndex(item => item.endpoint === subscription.endpoint);
			if (index > -1) {
				subscriptions.splice(index, 1);
			}

			return subscriptions;
		})
		.then(writeSubscription);

router
	.post('/subscribe', async ctx => {
		const body = await bodyParser(ctx.request);

		await addSubscription(body)
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

		await removeSubscription(body)
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
