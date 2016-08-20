/**
 * Created by jack on 16-8-21.
 */

import Vue from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import throttle from 'lodash/throttle';

import template from './nav.html';

export default Vue.component('navContainer', {
	template,
	methods: {
		addBodyListener() {
			this.isDesktop && document.addEventListener('scroll', throttle(this.bodyScrollListenerOfNav, 200));
		},
		removeBodyListener() {
			this.isDesktop && document.removeEventListener('scroll', this.bodyScrollListenerOfNav);
		},
		...mapActions(['bodyScrollListenerOfNav', 'initNavContainer', 'loadNavList'])
	},
	computed: {
		...mapGetters(['isDesktop', 'navList']),
		...mapState({
			isVisible: state => state.nav.isVisible,
			isFixed: state => state.nav.isFixed,
			isShown: state => state.nav.isShown
		})
	},
	created() {
		this.loadNavList();
	},
	mounted() {
		this.initNavContainer(this.isDesktop);
		this.addBodyListener();
	},
	destroyed() {
		this.removeBodyListener();
	}
});
