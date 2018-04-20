/**
 * Created by jack on 16-11-27.
 */

import Vue, { ComponentOptions } from 'vue';
import createApp from '@/app';
import '@/common/service/pwa/ServiceWorkerService';
import '@/common/service/pwa/NotificationService';

const { app, router, store } = createApp();

store.replaceState(window.__INITIAL_STATE__);

router.onReady(() => {
	// Add router hook for handling asyncData.
	// Doing it after initial route is resolved so that we don't double-fetch
	// the data that we already have. Using router.beforeResolve() so that all
	// async components are resolved.
	router.beforeResolve((to, from, next) => {
		const matched = router.getMatchedComponents(to);
		const prevMatched = router.getMatchedComponents(from);

		// we only care about none-previously-rendered components,
		// so we compare them until the two matched lists differ
		let diffed = false;
		const activated = matched.filter((c, i) => {
			return diffed || (diffed = (prevMatched[i] !== c));
		});

		if (!activated.length) {
			return next();
		}

		// this is where we should trigger a loading indicator if there is one

		Promise.all(activated.map((component: ComponentOptions<Vue>) => {
			if (component.preFetch) {
				return component.preFetch(store);
			}
		})).then(() => {
			next();
		}).catch(next);
	});

	app.$mount('#app');
});
