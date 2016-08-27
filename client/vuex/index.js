/**
 * Created by jack on 16-8-9.
 */

import Vue from 'vue';
import Vuex from 'vuex';
// import createLogger from 'vuex/logger';

import modules from './module';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	// can not judge run time environment
	// plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
	modules,
	strict: true
});
