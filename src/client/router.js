/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from 'containers/home';
import About from 'containers/about';
import Post from 'containers/post';
import Tags from 'containers/tags';

// Inject vue plugin
Vue.use(VueRouter);

const ROUTER_SETTING = {
	mode: 'history', // default value 'hash'
	routes: [
		{path: '/', component: Home},
		{path: '/about', component: About},
		{path: '/posts/:postName', component: Post},
		{path: '/tags', component: Tags},
		{path: '/tags/:tagName', component: Tags}
		// Using 404 page, when page not found.
		// catch all redirect, not matched path will be redirected to the home path
		// {path: '*', redirect: '/'}
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
