/**
 * Created by jack on 16-12-3.
 */

export const status: (response: Response) => Promise<Response | Error> = (response: Response) => {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
};

export const json: (response: Response) => Promise<JSON> = (response: Response) => response.json();

export const error = (err: Error, url: string, options?: object) => {
	console.log('Fetch Error:');
	console.log('Message: ', err);
	console.log('Url: ', url);
	console.log('Options: ', options);
};

const fetchRequest: (url: string, options?: object) => Promise<any> = (url: string, options?: object) => fetch(url, options)
	.then(status)
	.then(json)
	.catch(err => error(err, url, options));

export default fetchRequest;
