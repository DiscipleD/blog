/**
 * Created by jack on 16-4-16.
 */

import Vue from 'vue';
import { sync } from 'vuex-router-sync';

// Clean-log less transform to Clean-log cass
import '../assets/scss/clean-blog.scss';

// Fetch service polyfill
import 'whatwg-fetch';

import store from '../vuex';
import router from './router';
import './blog';
import '../component';

sync(store, router);

new Vue({
	store,
	router,
	template: '<blog></blog>'
}).$mount('#app');
