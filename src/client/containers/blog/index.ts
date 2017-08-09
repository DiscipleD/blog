/**
 * Created by jack on 16-8-14.
 */

import Vue, { ComponentOptions } from 'vue';
import { mapGetters, mapActions } from 'vuex';

import { setBlogTitle } from 'common/service/CommonService';
import template from './blog.html';

export interface IBlogContainer extends Vue {
	title: string;
	loadBrowserSetting: () => void;
	loadNavList: () => void;
	loadSocialLink: () => void;
}

export default Vue.component('blog', {
	template,
	created() {
		this.loadBrowserSetting();
		this.loadNavList();
		this.loadSocialLink();
	},
	computed: mapGetters(['isDesktop', 'navList', 'socialLinkList', 'title']),
	methods: mapActions(['loadBrowserSetting', 'loadNavList', 'loadSocialLink']),
	watch: {
		title() {
			setBlogTitle(this.title);
		},
	},
} as ComponentOptions<IBlogContainer>);
