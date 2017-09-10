/**
 * Created by jack on 16-8-15.
 */

import { Module, ActionTree, MutationTree } from 'vuex';

import { IRootState } from '../index';
import { ITagPage } from 'types/tag';
import { ITitle } from 'types/page';
import mutations from './mutations';
import actions from './actions';

export class TagsState {
	public header: ITitle;
	public list: ITagPage[];
	public isLoading: boolean;
	constructor() {
		this.header = {
			image: '',
			title: '',
		};
		this.isLoading = false;
	}
}

export default class TagsModule implements Module<TagsState, IRootState> {
	public state: TagsState;
	public actions: ActionTree<TagsState, IRootState>;
	public mutations: MutationTree<TagsState>;
	constructor() {
		this.state = new TagsState();
		this.actions = actions;
		this.mutations = mutations;
	}
}
