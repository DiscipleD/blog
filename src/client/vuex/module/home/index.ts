/**
 * Created by jack on 16-8-15.
 */

import { Module, ActionTree, GetterTree, MutationTree } from 'vuex';

import { IRootState } from '../index';
import { ITitle } from 'types/page';
import { IPager } from 'types/pager';
import Post from 'types/post';
import mutations from './mutations';
import actions from './actions';

export class HomeState {
	public header: ITitle;
	public posts: {
		list: Post[],
		pager: IPager,
		isFinished: boolean,
		isLoading: boolean,
	};
	constructor() {
		this.header = {
			image: '',
			title: '',
		};
		this.posts = {
			isFinished: false,
			isLoading: false,
			list: [],
			pager: {
				num: 0,
				size: 5,
			},
		};
	}
}

export default class HomeModule implements Module<HomeState, IRootState> {
	public state: HomeState;
	public actions: ActionTree<HomeState, IRootState>;
	public getters: GetterTree<HomeState, IRootState>;
	public mutations: MutationTree<HomeState>;
	constructor() {
		this.state = new HomeState();
		this.actions = actions;
		this.getters = {
			posts: (state: HomeState) => state.posts,
		};
		this.mutations = mutations;
	}
}
