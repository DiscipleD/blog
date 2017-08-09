/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 20/02/2017
 */

import SubscriptionService from './SubscriptionService';

const SERVICE_WORKER_API = 'serviceWorker';
const SERVICE_WORKER_FILE_PATH = '/service-worker.js';

const isSupportServiceWorker = () => SERVICE_WORKER_API in navigator;
const sendMessageToSW = (msg: string) => new Promise((resolve, reject) => {
	const messageChannel = new MessageChannel();
	messageChannel.port1.onmessage = (event: MessageEvent) => {
		if (event.data.error) {
			reject(event.data.error);
		} else {
			resolve(event.data);
		}
	};

	navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage(msg, [messageChannel.port2]);
});

if (isSupportServiceWorker()) {
	const sw = navigator.serviceWorker;

	sw.addEventListener('message', (e: ServiceWorkerMessageEvent) => console.log(e.data));

	sw.register(SERVICE_WORKER_FILE_PATH)
		.then((registration: ServiceWorkerRegistration) =>
			registration
				.pushManager
				.getSubscription()
				.then((subscription: PushSubscription) =>
					subscription || registration.pushManager.subscribe({ userVisibleOnly: true })))
		.then((subscription: PushSubscription) => SubscriptionService.subscript(subscription))
		.catch((error: Error) => console.error('Subscribe Failure: ', error.message))
		.then(() => sendMessageToSW('Hello, service worker.'))
		.catch(() => console.error('Send message error.'));
} else {
	console.info('Browser not support Service Worker.');
}
