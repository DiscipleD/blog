/**
 * Created by jack on 16-4-16.
 */

import Vue from 'vue';
import { sync } from 'vuex-router-sync';

// Clean-blog less transform to Clean-blog cass
import '@/assets/scss/clean-blog.scss';

// Fetch service polyfill
import 'whatwg-fetch';
import 'core-js/modules/es6.promise';

import createStore from './vuex';
import createRouter from './router';
import '@/containers/blog';
import '@/components';

const createApp = () => {
	const store = createStore();
	const router = createRouter();

	sync(store, router);

	const app = new Vue({
		store,
		router,
		render: (h) =>
			h(
				'div',
				{
					attrs: {
						id: 'app',
					},
				},
				[h('blog')],
			),
	});

	return {app, router, store};
};

export default createApp;
