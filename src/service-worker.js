/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 20/02/2017
 */

const _self = this;
const HOST_NAME = location.host;
const VERSION_NAME = 'CACHE-v1';
const CACHE_NAME = HOST_NAME + '-' + VERSION_NAME;
const CACHE_HOST = [HOST_NAME, 'cdn.bootcss.com'];
const SUBSCRIBE_API = '/publish/subscribe';

const sentMessage = function(msg) {
	_self.clients.matchAll().then(function(clients) {
		clients.forEach(function(client) {
			client.postMessage(msg);
		})
	});
};

const onInstall = function(event) {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(function() { _self.skipWaiting(); })
			.then(function() { console.log('Install success'); })
	);
};

const onActive = function(event) {
	event.waitUntil(
		caches
			.keys()
			.then(function(cacheNames) {
				return Promise.all(
					cacheNames.map(function(cacheName) {
						// Remove expired cache response
						if (CACHE_NAME.indexOf(cacheName) === -1) {
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(function() {
				_self.clients.claim();
			})
	);
};

const onMessage = function(event) {
	console.log(event.data);

	event.ports[0].postMessage('Hi, buddy.');
};

const isNeedCache = function(url) {
	return CACHE_HOST.some(function(host) {
		return url.search(host) !== -1;
	});
};

const isCORSRequest = function(url, host) {
	return url.search(host) === -1;
};

const isValidResponse = function(response) {
	return response && response.status >= 200 && response.status < 400;
};

const handleFetchRequest = function(req) {
	if (isNeedCache(req.url)) {
		const request = isCORSRequest(req.url, HOST_NAME) ? new Request(req.url, {mode: 'cors'}) : req;
		return caches.match(request)
			.then(function(response) {
				// Cache hit - return response directly
				if (response) {
					// Update Cache for next time enter
					fetch(request)
						.then(function(response) {

							// Check a valid response
							if(isValidResponse(response)) {
								caches
									.open(CACHE_NAME)
									.then(function (cache) {
										cache.put(request, response);
									});
							} else {
								sentMessage('Update cache ' + request.url + ' fail: ' + response.message);
							}
						})
						.catch(function(err) {
							sentMessage('Update cache ' + request.url + ' fail: ' + err.message);
						});
					return response;
				}

				// Return fetch response
				return fetch(request)
					.then(function(response) {
						// Check if we received an unvalid response
						if(!isValidResponse(response)) {
							return response;
						}

						const clonedResponse = response.clone();

						caches
							.open(CACHE_NAME)
							.then(function(cache) {
								cache.put(request, clonedResponse);
							});

						return response;
					});
			});
	} else {
		return fetch(req);
	}
};

const onFetch = function(event) {
	event.respondWith(handleFetchRequest(event.request));
};

const onPush = function(event) {
	const payload = event.data ? event.data.text() : '{}';
	const { body, link } = JSON.parse(payload);

	event.waitUntil(_self.registration.showNotification('New Post Arrival', {
		body,
		data: link,
		icon: '/logo.png'
	}));
};

const encodeStr = str => btoa(String.fromCharCode.apply(null, new Uint8Array(str)));
const getEncodeSubscriptionInfo = (subscription, type) => subscription.getKey ? encodeStr(subscription.getKey(type)) : '';
const onPushSubscriptionChange = function(event) {
	event.waitUntil(
		_self.registration.pushManager.subscribe({ userVisibleOnly: true })
			.then(function(subscription) {
				const endpoint = subscription.endpoint;
				const p256dh = getEncodeSubscriptionInfo(subscription, 'p256dh');
				const auth = getEncodeSubscriptionInfo(subscription, 'auth');

				const clientSubscription = { endpoint, keys: { p256dh, auth } };

				const options = {
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(clientSubscription)
				};

				return fetch(SUBSCRIBE_API, options);
			})
	);
};

const onNotificationClick = function(event) {
	event.notification.close();

	event.waitUntil(clients.openWindow(event.notification.data));
};

_self.addEventListener('install', onInstall);

_self.addEventListener('activate', onActive);

_self.addEventListener('message', onMessage);

_self.addEventListener('fetch', onFetch);

_self.addEventListener('push', onPush);

_self.addEventListener('notificationclick', onNotificationClick);

_self.addEventListener('pushsubscriptionchange', onPushSubscriptionChange);
