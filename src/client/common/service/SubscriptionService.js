/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 20/03/2017
 */

import httpFetch from './FetchService';

const SUBSCRIBE_API = '/publish/subscribe';

const encodeStr = str => btoa(String.fromCharCode.apply(null, new Uint8Array(str)));
const getEncodeSubscriptionInfo = (subscription, type) => subscription.getKey ? encodeStr(subscription.getKey(type)) : '';

class SubscriptionService {
	subscript(subscription) {
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

		return httpFetch(SUBSCRIBE_API, options);
	}
}

export default new SubscriptionService();
