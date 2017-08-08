/**
 * Created by jack on 16-4-25.
 */

import Vue, { ComponentOptions } from 'vue';

import { PostPage } from 'types/post';
import './post-header';
import template from './template.html';
import './style.scss';
import { IMAGE_SERVER_PREFIX } from '../../common/constant/site';
import DisqusService from '../../common/service/disqus/DisqusService';

interface PostComponent extends Vue {
	post: PostPage
}

export default Vue.component('post', {
	template,
	props: ['post'],
	computed: {
		headerUrl: function() {
			return IMAGE_SERVER_PREFIX + this.post.name + '/' + this.post.headerImgName;
		},
		prev: function() {
			return this.post.prevPost
				? { ...this.post.prevPost, text: 'prev post' }
				: null;
		},
		next: function() {
			return this.post.nextPost
				? { ...this.post.nextPost, text: 'next post' }
				: null;
		}
	},
	mounted: function() {
		DisqusService.loadDisqusPlugin();
		const disqueService = new DisqusService();
		disqueService.resetDisqusPlugin(this.post.name, this.post.title);
	}
} as ComponentOptions<PostComponent>);
