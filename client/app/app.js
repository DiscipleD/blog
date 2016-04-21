/**
 * Created by jack on 16-4-16.
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

import Router from './router';
import '../component';

if (module.hot) {
	module.hot.accept();
}

// vue 插件的装入
Vue.use(VueRouter);

let app = Vue.extend({});
let router = new VueRouter();

router.map(Router);

router.start(app, '#app');

console.log('bbbc');
