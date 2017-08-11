/**
 * Created by jack on 16-8-15.
 */

import { Module, ActionTree, GetterTree, MutationTree } from 'vuex';

import { IRootState } from '../index';
import { BLOG_TITLE } from 'common/constant/site';
import { Item } from 'types/nav';
import { ISocialLink } from './setting';
import mutations from './mutations';
import actions from './actions';

export class SiteState {
	public title: string;
	public navList: Item[];
	public socialLinkList: ISocialLink[];
	constructor(title: string) {
		this.title = title;
	}
}

export default class SiteModule implements Module<SiteState, IRootState> {
	public state: SiteState;
	public actions: ActionTree<SiteState, IRootState>;
	public getters: GetterTree<SiteState, IRootState>;
	public mutations: MutationTree<SiteState>;
	constructor() {
		this.state = new SiteState(BLOG_TITLE);
		this.actions = actions;
		this.getters = {
			title: (state: SiteState) => state.title,
			navList: (state: SiteState) => state.navList,
			socialLinkList: (state: SiteState) => state.socialLinkList,
		};
		this.mutations = mutations;
	}
}
