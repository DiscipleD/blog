/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import { IPostPage } from 'types/post';
import './post-header';
import template from './template.html';
import './style.scss';
import { IMAGE_SERVER_PREFIX } from '../../common/constant/site';
import DisqusService from '../../common/service/disqus/DisqusService';

@Component({
	props: ['post'],
	template,
})
class Post extends Vue {
	public post: IPostPage;

	protected mounted() {
		DisqusService.loadDisqusPlugin();
		const disqueService = new DisqusService();
		disqueService.resetDisqusPlugin(this.post.name, this.post.title);
	}

	/*
	 * computer start
	 */
	get headerUrl() {
		return IMAGE_SERVER_PREFIX + this.post.name + '/' + this.post.headerImgName;
	}
	get prev() {
		return this.post.prevPost
			? { ...this.post.prevPost, text: 'prev post' }
			: null;
	}
	get next() {
		return this.post.nextPost
			? { ...this.post.nextPost, text: 'next post' }
			: null;
	}
	/*
	 * computer end
	 */
}

export default Vue.component('post', Post);
