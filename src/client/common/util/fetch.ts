/**
 * Created by jack on 16-12-3.
 */

export const status = (response: Response) => {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
};

export const json = (response: Response) => response.json();

export const error = (err: Error, url: RequestInfo, options?: RequestInit) => {
	console.log('Fetch Error:');
	console.log('Message: ', err);
	console.log('Url: ', url);
	console.log('Options: ', options);
};

const fetchRequest = (url: RequestInfo, options?: RequestInit) => fetch(url, options)
	.then(status)
	.then(json)
	.catch((err: Error) => error(err, url, options));

export default fetchRequest;
