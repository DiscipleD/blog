/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import template from './post.html';
import PostService from '../../common/service/PostService';

const Post = Vue.extend({
	template,
	data: () => {
		return {
			post: {}
		};
	},
	route: {
		data: transition => {
			// direct return promise not works well when user go some page and go back to the wrong route.
			// return PostService.queryPost(transition.to.params.postName);
			PostService.queryPost(transition.to.params.postName).then(post => {
				transition.next(post);
			}).catch(err => {
				console.error(err + 'Page will redirect to the Home page.');
				transition.redirect('/');
			});
		}
	}
});

export default Post;
