/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';
import template from './post.html';

import Post from './post';

const PostComponent = Vue.component('Post', {
	template,
	data: () => {
		return {
			post: {}
		};
	},
	route: {
		data: transition => {
			let post = new Post();
			post.queryPost(transition.to.params.postTitle);
			return {
				post
			};
		}
	}
});

export default PostComponent;
