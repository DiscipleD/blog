/**
 * Created by d.d on 18/07/2017.
 */

export const queryUrlParams: (url: string) => object = (url: string = '') => {
  const reg = /([^\/&=]+)(=([^\/&=]+)?)/g;
  let params: {[key: string]: string} = {};
  const searchIndex: number = url.indexOf('?');
  if (searchIndex < 0) return params;
  url.replace(reg, function (s, k, e, v) {
    params[k] = decodeURIComponent(v);
    return s;
  });
  return params;
};

export const setUrlParams: (url: string, params: {[key: string]: string}) => string = (url: string, params: {[key: string]: string} = {}) => {
  const searchIndex: number = url.indexOf('?');
  const path: string = searchIndex < 0 ? url : url.slice(0, searchIndex);
  const newParams: {[key: string]: string} = {
    ...queryUrlParams(url),
    ...params
  };
  return `${path}?` + Object.keys(newParams).reduce((str: string, key: string) => {
    str += `&${key}=${encodeURI(newParams[key])}`;
    return str;
    }, '');
};
