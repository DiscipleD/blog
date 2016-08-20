/**
 * Created by jack on 16-8-9.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/logger';

import browser from './module/browser';
import socialLink from './module/social-link';
import nav from './module/nav';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
	modules: {
		browser,
		nav,
		socialLink
	}
});
