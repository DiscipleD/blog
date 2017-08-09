/**
 * Created by jack on 16-8-15.
 */

import { Module, ActionTree, MutationTree } from 'vuex';

import { IRootState } from '../index';
import Post from '../../../../types/post'; // ts module bug, it should work well with 'types/post', but not
import mutations from './mutations';
import actions from './actions';

export class PostState {
	public post: Post;
	public isLoading: boolean;
	constructor() {
		this.isLoading = false;
		this.post = new Post();
	}
}

export default class PostModule implements Module<PostState, IRootState> {
	public state: PostState;
	public actions: ActionTree<PostState, IRootState>;
	public mutations: MutationTree<PostState>;
	constructor() {
		this.state = new PostState();
		this.actions = actions;
		this.mutations = mutations;
	}
}
