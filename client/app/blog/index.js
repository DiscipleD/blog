/**
 * Created by jack on 16-8-14.
 */

import vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

import template from './blog.html';

export default vue.component('blog', {
	template,
	created() {
		this.loadNavList();
		this.loadSocialLink();
	},
	computed: mapGetters(['navList', 'socialLinkList']),
	methods: mapActions(['loadNavList', 'loadSocialLink'])
});
