/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import './post-header';
import template from './post.html';
import './post.scss';
import DisqusService from '../../common/service/DisqusService';

const PostComponent = Vue.component('post', {
	template,
	props: ['post'],
	computed: {
		headerUrl: function() {
			const imgStorage = 'http://o7nu3cbe9.bkt.clouddn.com/blog/';
			return imgStorage + this.post.name + '/' + this.post.headerImgName;
		}
	},
	mounted: function() {
		DisqusService.loadDisqusPlugin();
		const disqueService = new DisqusService();
		disqueService.resetDisqusPlugin(this.post.name, this.post.title);
	}
});

export default PostComponent;
