/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import template from './post.html';
import PostService from '../../../common/service/PostService';

const Post = Vue.extend({
	template,
	data: () => {
		return {
			post: {}
		};
	},
	created() {
		this.getPostContent();
	},
	watch: {
		'$route': 'getPostContent'
	},
	methods: {
		getPostContent() {
			PostService.queryPost(this.$route.params.postName).then(data => {
				this.post = data.post;
			}).catch(err => {
				console.error(err + 'Page will redirect to the Home page.');
				this.$router.replace('/');
			});
		}
	}
});

export default Post;
