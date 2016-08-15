/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './blog/home/home';
import About from './blog/about/about';
import Post from './blog/post/post';

// Inject vue plugin
Vue.use(VueRouter);

const ROUTER_SETTING = {
	/* H5 Mode will access server first, that will cause no source file error
	 it can be use when using SSR (server side render).
	 Todo - SSR: priority 2 */
	mode: 'hash', // default value
	routes: [
		{path: '/', component: Home},
		{path: '/about', component: About},
		{path: '/posts/:postName', component: Post},
		// catch all redirect, not matched path will be redirected to the home path
		{path: '*', redirect: '/'}
	]
};

const router = new VueRouter(ROUTER_SETTING);

// manually hook: page not scroll to top when router changes
// github issue: https://github.com/vuejs/vue-router/issues/173
router.beforeEach((route, redirect, next) => {
	window.scrollTo(0, 0);
	next();
});

router.afterEach(route => {
	console.info(`${new Date()}: ${route.path}`);
});

export default router;
