/**
 * Created by jack on 16-8-24.
 */

import fetchUtil from '../util/Fetch';
import SERVER from '../constant/server';

export const generatorUrl = (url = '', params = '') =>
	params ? url + '?' + generatorQueryString(params) : url;

export const generatorQueryString = params =>
	typeof params === 'object'
		? Object.keys(params).map(key => key + '=' + JSON.stringify(params[key])).join('&')
		: params;

// TODO
const httpFetch = (url, options) => {
	url = SERVER.HOST + url;
	return fetchUtil(url, options);
};

export default httpFetch;
