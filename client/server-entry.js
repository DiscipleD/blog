/**
 * Created by jack on 16-11-27.
 */

import { app, router, store } from './app';

// Add global variables for node environment.
const jsdom = require('jsdom').jsdom;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;
global.fetch = require('node-fetch');

export default context => {
	console.log(context);

	// set router's location
	router.push(context.url);
	const matchedComponents = router.getMatchedComponents();

	// no matched routes
	if (!matchedComponents.length) {
		return Promise.reject({ code: '404' });
	}

	// Call preFetch hooks on components matched by the route.
	// A preFetch hook dispatches a store action and returns a Promise,
	// which is resolved when the action is complete and store state has been
	// updated.
	return Promise.all(matchedComponents.map(component => {
		if (component.preFetch) {
			return component.preFetch(store);
		}
	})).then(() => {
		// After all preFetch hooks are resolved, our store is now
		// filled with the state needed to render the app.
		// Expose the state on the render context, and let the request handler
		// inline the state in the HTML response. This allows the client-side
		// store to pick-up the server-side state without having to duplicate
		// the initial data fetching on the client.
		context.initialState = store.state;
		return app;
	});

};
