/**
 * Created by jack on 16-4-16.
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

// Clean-log less transform to Clean-log cass
import '../assets/scss/clean-blog.scss';

import Router from './router';
import '../component';

// vue 插件的装入
Vue.use(VueRouter);

let app = Vue.extend({});
let router = new VueRouter();
/* H5 Mode will access server first, that will cause no source file error
it can be use when using SSR (server side render).
Todo - SSR: priority 2
let router = new VueRouter({
	hashbang: false,
	history: true,
	saveScrollPosition: true
});*/

router
	.map(Router)
	.redirect({
		// not matched path will be redirected to the home path
		'*': '/'
	})
	// manually hook: page not scroll to top when router changes
	// github issue: https://github.com/vuejs/vue-router/issues/173
	.beforeEach(transition => {
		window.scrollTo(0, 0);
		transition.next();
	})
	.afterEach(transition => {
		console.info(`${new Date()}: ${transition.to.path}`);
	})
	.start(app, '#app');
