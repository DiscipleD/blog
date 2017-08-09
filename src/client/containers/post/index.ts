/**
 * Created by jack on 16-4-25.
 */

import Vue, { ComponentOptions } from 'vue';
import { mapActions, mapState, Store} from 'vuex';
import VueRouter from 'vue-router';

import Post from 'types/post';
import { getActionContext } from 'vuexModule/../common/actionHelper';
import template from './post.html';
import { IRootState } from 'vuexModule/index';
import { PostState } from 'vuexModule/post';
import postActions, { IPostQueryParam } from 'vuexModule/post/actions';

export interface IPostContainer extends Vue {
	post: Post;
	postName: string;
	getPost: (params: IPostQueryParam) => void;
}

export default Vue.extend({
	template,
	computed: mapState({
		post: (state: IRootState) => state.post.post,
		isLoading: (state: IRootState) => state.post.isLoading,
		postName: (state: IRootState) => state.route.params.postName,
	}),
	methods: mapActions(['getPost']),
	created() {
		this.getPost({
			postName: this.postName,
			router: this.$router,
		});
	},
	watch: {
		postName() {
			this.getPost({
				postName: this.postName,
				router: this.$router,
			});
		},
	},
	preFetch(store: Store<IRootState>, router: VueRouter) {
		const actionContext = getActionContext<PostState, IRootState>('post', store);
		return postActions.getPost(actionContext, {
			postName: store.state.route.params.postName,
			enableLoading: false,
			router,
		});
	},
} as ComponentOptions<IPostContainer>);
