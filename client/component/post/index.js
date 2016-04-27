/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import './post-header';

import template from './post.html';
import './post.scss';
import PostService from './post';

const PostComponent = Vue.component('Post', {
	template,
	data: () => {
		return {
			post: {}
		};
	},
	route: {
		data: transition => {
			let post = PostService.queryPost(transition.to.params.postTitle);
			return {
				post
			};
		}
	}
});

export default PostComponent;
