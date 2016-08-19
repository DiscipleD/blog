/**
 * Created by jack on 16-8-9.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/logger';

import socialLink from './module/social-link';
import nav from './module/nav-list';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
	modules: {
		nav,
		socialLink
	}
});
