/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 05/03/2017
 */

import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'co-body';
import webPush from 'web-push';

import { readFile, writeFile } from '../common/DataService';
import { gcmAPIKey } from '../config';

const publishApp = new Koa();
const router = new Router();

const SUBSCRIPTION_FILE = path.resolve(__dirname, '../../../data/subscriptions.txt');
const TOKEN_FILE_PATH = path.resolve(__dirname, '../../../data/token.txt');

const parseSubscriptions = string => string.split('\n').filter(item => !!item).map(item => JSON.parse(item));
const stringifySubscriptions = subscriptions => subscriptions.map(item => JSON.stringify(item)).join('\n');

const isVerifyMessage = async message => {
	const token = await readFile(TOKEN_FILE_PATH).then(b => b.toString().replace(/\s/g, ''));
	return message.token === token;
};

const readSubscriptions = () => readFile(SUBSCRIPTION_FILE, { encoding: 'utf8' })
	.then(buffer => parseSubscriptions(buffer.toString()))
	.catch(err => {
		console.error(err);
		return [];
	});

const writeSubscription = subscriptions => writeFile(SUBSCRIPTION_FILE, stringifySubscriptions(subscriptions), { encoding: 'utf8' });

const addSubscription = subscription =>
	readSubscriptions()
		.then(subscriptions => {
			if (!subscriptions.find(item => item.endpoint === subscription.endpoint)) {
				subscriptions.push(subscription);
			}
			return subscriptions;
		})
		.then(writeSubscription);

const removeSubscriptions = subs =>
	readSubscriptions()
		.then(subscriptions => subscriptions.filter(subscription => !subs.find(item => item.endpoint === subscription.endpoint)))
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

		await removeSubscriptions([body])
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
		const isVerified = await isVerifyMessage(body);

		if (isVerified) {
			await readSubscriptions()
			.then(subscriptions => new Promise(resolve => {
				if (!subscriptions || subscriptions.length === 0) resolve([]);
				let i = 0;
				const errorSubscriptions = [];
				const resolveErrorSubsriptions = (len, subscribes) => subscriptions.length === len && resolve(subscribes);

				subscriptions.forEach(subscription => {
					webPush.sendNotification(subscription, JSON.stringify(body), { gcmAPIKey })
						.then(() => resolveErrorSubsriptions(++i, errorSubscriptions))
						.catch(err => {
							console.error(err);
							// retain the subscription, if the error cause by network not access (GREAT WALL)
							if (err.code !== 'ETIMEDOUT') errorSubscriptions.push(subscription);

							resolveErrorSubsriptions(++i, errorSubscriptions);
						});
				});
			}))
			.then(subscriptions => {
				ctx.status = 200;
				ctx.body = subscriptions;
				removeSubscriptions(subscriptions);
			})
			.catch(err => {
				ctx.status = 500;
				ctx.body = err;
			});
		} else {
			ctx.status = 400;
			ctx.body = 'Buddy, you forgot the password! (:';
		}
	});

publishApp
	.use(router.routes())
	.use(router.allowedMethods());

export default publishApp;
