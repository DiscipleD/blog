/**
 * Created by jack on 16-8-22.
 */

import fs from 'fs';
import marked from 'marked';

const readMarkdownFile = (path = '', encoding = 'utf8') => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, encoding, (err, data) => {
			if (err) return reject(err); // reject not stop the method

			resolve(marked(data));
		});
	});
};

const sortFn = (key = '', order = 1) => (curr, next) =>
	(typeof key === 'function' ? key(curr) > key(next) : curr[key] > next[key]) ? -order : +order;

const normalize = data => Array.isArray(data)
	? data.reduce((prev, curr) => ({...prev, [curr.id]: curr}), {}) : data;

export {readMarkdownFile, sortFn, normalize}
