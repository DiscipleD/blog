/**
 * Created by jack on 16-8-9.
 */

import Vue from 'vue';
import Vuex from 'vuex';
// import createLogger from 'vuex/logger';

import browser from './module/browser';
import socialLink from './module/social-link';
import nav from './module/nav';
import home from './module/home';
import aboutMe from './module/about-me';
import post from './module/post';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	// can not judge run time environment
	// plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
	modules: {
		browser,
		nav,
		socialLink,
		aboutMe,
		home,
		post
	},
	strict: true
});
