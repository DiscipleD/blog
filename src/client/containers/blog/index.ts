/**
 * Created by jack on 16-8-14.
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import { mapGetters, mapActions } from 'vuex';

import { setBlogTitle } from '@/common/service/CommonService';
import template from './blog.html';

@Component({
	computed: mapGetters(['isDesktop', 'navList', 'socialLinkList', 'title']),
	methods: mapActions(['loadBrowserSetting', 'loadNavList', 'loadSocialLink']),
	template,
	watch: {
		title() {
			setBlogTitle((this as BlogContainer).title);
		},
	},
})
class BlogContainer extends Vue {
	public title: string;
	public loadBrowserSetting: () => void;
	public loadNavList: () => void;
	public loadSocialLink: () => void;

	public created() {
		this.loadBrowserSetting();
		this.loadNavList();
		this.loadSocialLink();
	}
}

export default Vue.component('blog', BlogContainer);
