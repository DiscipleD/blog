/**
 * Created by jack on 16-8-24.
 */

export const generatorUrl = (url, params) => typeof params === 'object' ? url + params : url + '?' + params;

export const status = response => {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
};

export const json = response => response.json();
