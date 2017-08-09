/**
 * Created by jack on 16-8-15.
 */

import { Module, ActionTree, MutationTree } from 'vuex';

import { IRootState } from '../index';
import mutations from './mutations';
import actions from './actions';
import { ITitle } from 'types/page';

export class AboutMeState {
	public header: ITitle;
	public introduction: any[];
}

export default class AboutMeModule implements Module<AboutMeState, IRootState> {
	public state: AboutMeState;
	public actions: ActionTree<AboutMeState, IRootState>;
	public mutations: MutationTree<AboutMeState>;
	constructor() {
		this.state = new AboutMeState();
		this.actions = actions;
		this.mutations = mutations;
	}
}
