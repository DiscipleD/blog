/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './home/home';
import About from './about/about';
import Post from './post/post';

// Inject vue plugin
Vue.use(VueRouter);

const router = new VueRouter({
	/* H5 Mode will access server first, that will cause no source file error
	 it can be use when using SSR (server side render).
	 Todo - SSR: priority 2 */
	mode: 'hash', // default value
	routes: [
		{path: '/', component: Home},
		{path: '/about', component: About},
		{path: '/home', component: Home},
		{path: '/posts/:postName', component: Post},
		// catch all redirect, not matched path will be redirected to the home path
		{path: '*', redirect: '/'}
	],
	beforeEach(transition) {
		window.scrollTo(0, 0);
		transition.next();
	},
	afterEach(transition) {
		console.info(`${new Date()}: ${transition.to.path}`);
	}
});

export default router;
