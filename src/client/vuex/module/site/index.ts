/**
 * Created by jack on 16-8-15.
 */

import { BLOG_TITLE } from 'common/constant/site';
import { Item } from 'types/nav';
import { SocialLink } from './setting';
import mutations from './mutations';
import actions from './actions';

export class SiteState {
	title: string;
	navList: Array<Item>;
	socialLinkList: Array<SocialLink>
	constructor(title: string) {
		this.title = title;
	}
}

export default {
	state: new SiteState(BLOG_TITLE),
	getters: {
		title: (state: SiteState) => state.title,
		navList: (state: SiteState) => state.navList,
		socialLinkList: (state: SiteState) => state.socialLinkList
	},
	actions,
	mutations
};
