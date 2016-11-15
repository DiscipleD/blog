/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';

import template from './template.html';
import './style.scss';

export default Vue.component('navigation', {
	template,
	props: ['navList', 'isShown'],
	data: () => ({
		isShow: false
	}),
	watch: {
		isShown(newVal) {
			this.isShow = newVal;
		}
	},
	mounted() {
		this.isShow = this.isShown;
	},
	methods: {
		toggleNavShown: function() {
			this.isShow = !this.isShow;
		}
	}
});
