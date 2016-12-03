/**
 * Created by jack on 16-12-3.
 */

export const status = response => {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
};

export const json = response => response.json();

export const error = (err, url, options) => {
	console.log('Fetch Error:');
	console.log('Message: ' + err);
	console.log('Url: ' + url);
	console.log('Options: ' + options);
};

const httpFetch = (url, options) => fetch(url, options)
	.then(status)
	.then(json)
	.catch(err => error(err, url, options));

export default httpFetch;
