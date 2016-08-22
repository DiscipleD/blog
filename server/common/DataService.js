/**
 * Created by jack on 16-8-22.
 */

const sortFn = (name = '', order = 1) => (curr, next) => curr[name] > next[name] ? -order : +order;

const normalize = data => Array.isArray(data)
	? data.reduce((prev, curr) => ({...prev, [curr.id]: curr}), {}) : data;

export {sortFn, normalize}
