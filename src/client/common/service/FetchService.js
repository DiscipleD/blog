/**
 * Created by jack on 16-8-24.
 */

export const generatorUrl = (url = '', params = '') =>
	params ? url + '?' + generatorQueryString(params) : url;

export const generatorQueryString = params =>
	typeof params === 'object'
		? Object.keys(params).map(key => key + '=' + JSON.stringify(params[key])).join('&')
		: params;

export const status = response => {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
};

export const json = response => response.json();

const httpFetch = (url, options) => fetch(url, options)
	.then(status)
	.then(json);

export default httpFetch;
