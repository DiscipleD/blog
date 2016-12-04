/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';
import {mapActions, mapState} from 'vuex';

import template from './post.html';
import postActions from 'vuexModule/post/actions';

const Post = Vue.extend({
	template,
	computed: mapState({
		post: state => state.post.post,
		isLoading: state => state.post.isLoading,
		postName: state => state.route.params.postName
	}),
	methods: mapActions(['getPost']),
	created() {
		this.getPost({
			postName: this.postName,
			enableLoading: this.$root._isMounted,
			router: this.$router
		});
	},
	watch: {
		'postName': function() {
			this.getPost({
				postName: this.postName,
				router: this.$router
			});
		}
	},
	preFetch(store) {
		return postActions.getPost(store, {
			postName: store.state.route.params.postName,
			enableLoading: false,
			router: this.$router
		});
	}
});

export default Post;
