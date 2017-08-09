/**
 * Created by jack on 16-8-9.
 */

import Vue from 'vue';
import Vuex from 'vuex';
// import createLogger from 'vuex/dist/logger';

import createModules from './module';

Vue.use(Vuex);

const createStore = () =>
	new Vuex.Store({
		// plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
		modules: createModules(),
		strict: true,
	});

export default createStore;
