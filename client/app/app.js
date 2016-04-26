/**
 * Created by jack on 16-4-16.
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

// Bootstrap Core CSS for Clean-blog
import '../assets/css/bootstrap.min.css';
import '../assets/lib/bootstrap.min';
// Clean-log less transform to Clean-log cass
import '../assets/scss/clean-blog.scss';

import Router from './router';

if (module.hot) {
	module.hot.accept();
}

// vue 插件的装入
Vue.use(VueRouter);

let app = Vue.extend({});
let router = new VueRouter();

router.map(Router);

router.start(app, '#app');
