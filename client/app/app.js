/**
 * Created by jack on 16-4-16.
 */

import Vue from 'vue';

// Clean-log less transform to Clean-log cass
import '../assets/scss/clean-blog.scss';

import router from './router';
import '../component';

import template from './app.html';

new Vue({
	router,
	template
}).$mount('#app');
