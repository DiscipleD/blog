/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import { mapActions, mapState, Store} from 'vuex';
import VueRouter from 'vue-router';

import Post from 'types/post';
import { getActionContext } from 'vuexModule/../common/actionHelper';
import template from './post.html';
import { IRootState } from 'vuexModule/index';
import { PostState } from 'vuexModule/post';
import postActions, { IPostQueryParam } from 'vuexModule/post/actions';

@Component({
	computed: mapState({
		post: (state: IRootState) => state.post.post,
		isLoading: (state: IRootState) => state.post.isLoading,
		postName: (state: IRootState) => state.route.params.postName,
	}),
	methods: mapActions(['getPost']),
	watch: {
		postName() {
			(this as PostContainer).getPost({
				postName: (this as PostContainer).postName,
				router: this.$router,
			});
		},
	},
	template,
	preFetch(store: Store<IRootState>, router: VueRouter) {
		const actionContext = getActionContext<PostState, IRootState>('post', store);
		return postActions.getPost(actionContext, {
			postName: store.state.route.params.postName,
			enableLoading: false,
			router,
		});
	},
})
export default class PostContainer extends Vue {
	public post: Post;
	public postName: string;
	public getPost: (params: IPostQueryParam) => void;

	public mounted() {
		this.getPost({
			postName: this.postName,
			router: this.$router,
		});
	}
}
