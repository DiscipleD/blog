/**
 * Created by jack on 16-8-14.
 */

import vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

import './nav/nav';
import template from './blog.html';

export default vue.component('blog', {
	template,
	created() {
		this.loadBrowserSetting();
		this.loadSocialLink();
	},
	computed: mapGetters(['socialLinkList']),
	methods: mapActions(['loadBrowserSetting', 'loadSocialLink'])
});
