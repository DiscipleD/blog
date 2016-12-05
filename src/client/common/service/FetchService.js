/**
 * Created by jack on 16-8-24.
 */

import fetch from '../util/Fetch';
import SERVER from '../config/server';

export const generatorUrl = (url = '', params = '') =>
	params ? url + '?' + generatorQueryString(params) : url;

export const generatorQueryString = params =>
	typeof params === 'object'
		? Object.keys(params).map(key => key + '=' + JSON.stringify(params[key])).join('&')
		: params;

const httpFetch = (url, options) => {
	url = SERVER.HOST + url;
	return fetch(url, options);
};

export default httpFetch;
