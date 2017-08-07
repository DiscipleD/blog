/**
 * Created by jack on 16-4-25.
 */

import Vue, { ComponentOptions } from 'vue';
import { mapActions, mapState, Store} from 'vuex';
import VueRouter from 'vue-router';

import Post from 'types/post';
import { getActionContext } from 'vuexModule/../common/actionHelper';
import template from './post.html';
import { RootState } from 'vuexModule/index';
import { PostState } from 'vuexModule/post';
import postActions, { PostQueryParam } from 'vuexModule/post/actions';

export interface PostContainer extends Vue {
	post: Post,
	postName: string,
	getPost: (params: PostQueryParam) => void
}

export default Vue.extend({
	template,
	computed: mapState({
		post: (state: RootState) => state.post.post,
		isLoading: (state: RootState) => state.post.isLoading,
		postName: (state: RootState) => state.route.params.postName
	}),
	methods: mapActions(['getPost']),
	created() {
		this.getPost({
			postName: this.postName,
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
	preFetch(store: Store<RootState>, router: VueRouter) {
		const actionContext = getActionContext<PostState, RootState>('post', store);
		return postActions.getPost(actionContext, {
			postName: store.state.route.params.postName,
			enableLoading: false,
			router
		});
	}
} as ComponentOptions<PostContainer>);
