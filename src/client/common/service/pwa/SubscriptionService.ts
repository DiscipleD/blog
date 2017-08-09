/**
 * Created by d.d on 18/07/2017.
 */

import fetchRequest from '../../util/fetch';
import Server from '../../constant/server';

const SUBSCRIBE_API = '/publish/subscribe';

const encodeStr = (str: ArrayBuffer) => btoa(String.fromCharCode.apply(null, new Uint8Array(str)));
const getEncodeSubscriptionInfo = (subscription: PushSubscription, type: PushEncryptionKeyName) => {
	const buffer = subscription.getKey(type);
	return buffer ? encodeStr(buffer) : '';
};

class SubscriptionService {
	public subscript(subscription: PushSubscription) {
		const endpoint = subscription.endpoint;
		const p256dh = getEncodeSubscriptionInfo(subscription, 'p256dh');
		const auth = getEncodeSubscriptionInfo(subscription, 'auth');

		const clientSubscription = { endpoint, keys: { p256dh, auth } };

		const options = {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(clientSubscription),
		};

		return fetchRequest(Server.HOST + SUBSCRIBE_API, options);
	}
}

export default new SubscriptionService();
