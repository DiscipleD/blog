/**
 * Created by jack on 16-4-16.
 */

import Vue from 'vue';
import { sync } from 'vuex-router-sync';

// Clean-blog less transform to Clean-blog cass
import 'assets/scss/clean-blog.scss';

// Fetch service polyfill
import 'whatwg-fetch';
import 'core-js/modules/es6.promise';

import store from './vuex';
import router from './router';
import 'containers/blog';
import 'components';

sync(store, router);

new Vue({
	store,
	router,
	template: '<blog></blog>'
}).$mount('#app');
