/**
 * Created by jack on 16-8-20.
 */

import { Module, ActionTree, GetterTree, MutationTree } from 'vuex';

import { IRootState } from '../index';
import mutations from './mutations';
import actions from './actions';

export class BrowserState {
	public clientWidth: number;
	constructor() {
		this.clientWidth = 0;
	}
}

const MIN_SCREEN_WIDTH: number = 768;

export default class BrowserModule implements Module<BrowserState, IRootState> {
	public state: BrowserState;
	public actions: ActionTree<BrowserState, IRootState>;
	public getters: GetterTree<BrowserState, IRootState>;
	public mutations: MutationTree<BrowserState>;
	constructor() {
		this.state = new BrowserState();
		this.actions = actions;
		this.getters = {
			isDesktop: (state: BrowserState) => state.clientWidth >= MIN_SCREEN_WIDTH,
		};
		this.mutations = mutations;
	}
}
