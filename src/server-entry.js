/**
 * Created by jack on 16-11-27.
 */

import createApp from './client/app';
import { getBlogTitle } from 'common/service/CommonService';
import siteActions from 'vuexModule/site/actions';

// Add global variables for node environment.
const jsdom = require('jsdom').jsdom;
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;
global.fetch = require('node-fetch');

export default context => {
	const { app, router, store } = createApp();
	// set router's location
	router.push(context.url);
	const matchedComponents = router.getMatchedComponents();

	// no matched routes
	if (!matchedComponents.length) {
		return Promise.reject({code: '404'});
	}

	// Call preFetch hooks on components matched by the route.
	// A preFetch hook dispatches a store action and returns a Promise,
	// which is resolved when the action is complete and store state has been
	// updated.
	return Promise.all(matchedComponents.map(component => {
		if (component.options.preFetch) {
			return component.options.preFetch(store, router);
		}
	}))
		// special handle nav state load, which can't be added in preFetch hook
		.then(() => siteActions.loadNavList(store))
		.then(() => {
			context.title = getBlogTitle(store.state.site.title);
			// After all preFetch hooks are resolved, our store is now
			// filled with the state needed to render the app.
			// Expose the state on the render context, and let the request handler
			// inline the state in the HTML response. This allows the client-side
			// store to pick-up the server-side state without having to duplicate
			// the initial data fetching on the client.
			context.state = store.state;
			return app;
		});

};
