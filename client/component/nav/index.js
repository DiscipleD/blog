/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import {mapActions} from 'vuex';

import template from './template.html';
import './style.scss';

export default Vue.component('navigation', {
	template,
	props: ['navList', 'isShown'],
	methods: mapActions(['toggleNavShown'])
});
