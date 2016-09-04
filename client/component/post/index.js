/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import './post-header';
import template from './template.html';
import './style.scss';
import DisqusService from '../../common/service/DisqusService';

const PostComponent = Vue.component('post', {
	template,
	props: ['post'],
	computed: {
		headerUrl: function() {
			const imgStorage = 'http://o7nu3cbe9.bkt.clouddn.com/blog/';
			return imgStorage + this.post.name + '/' + this.post.headerImgName;
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
});

export default PostComponent;
