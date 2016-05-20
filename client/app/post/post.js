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
		// activate hook will be called only when the component generator. if the component can be reuse, that hook not be called
		// data hook will be called every time the router change, and it also can set 'waitForData' option in router file
		// that will cause component load lifecycle(activate, ready, etc.) wait data resolved.
		data: transition => {
			// direct return promise not works well when user go some page and go back to the wrong route.
			// return PostService.queryPost(transition.to.params.postName);
			PostService.queryPost(transition.to.params.postName).then(post => {
				transition.next(post);
			}).catch(err => {
				console.error(err + 'Page will redirect to the Home page.');
				transition.redirect('/');
			});
		},
		// set this attr will not reuse the component that child component ready hook will be called every time, default value is true
		canReuse: false,
		waitForData: true
	}
});

export default Post;
