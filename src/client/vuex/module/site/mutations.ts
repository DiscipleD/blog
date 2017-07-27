/**
 * Created by jack on 16-8-16.
 */

import { Item } from '../../../../types/nav'; // ts module bug, it should work well with 'types/nav', but not
import svgPath from './social-link.svg';
import { Mutation } from '../../common/actionHelper';
import { SiteState } from './index'
import { SocialLink } from './setting';
import { LOAD_NAV_LIST, LOAD_SOCIAL_LINK, SET_BLOG_TITLE } from './actions';
import { isSupportShareAPI, sharePage } from 'common/service/CommonService';

const initNavList = () => {
	const navList: Item[] = [];
	navList.push(new Item('home', 'Home', '/'));
	navList.push(new Item('aboutMe', 'About', '/about'));
	navList.push(new Item('tags', 'Tags', '/tags'));
	isSupportShareAPI() && navList.push(new Item('share', 'Share', '', sharePage));
	return navList;
};

const mutations = {
	[LOAD_NAV_LIST](state: SiteState, mutation: Mutation) {
		const navList = initNavList();
		navList.push(new Item('latestPost', 'Latest Post', `/posts/${mutation.payload.name}`));
		state.navList = navList;
	},

	[LOAD_SOCIAL_LINK](state: SiteState, mutation: Mutation) {
		state.socialLinkList = mutation.payload
			.filter((item: SocialLink) => !!item.link)
			.map((item: SocialLink) => ({
				...item,
				svgPath: svgPath + '#' + item.name
			}));
	},

	[SET_BLOG_TITLE](state: SiteState, mutation: Mutation) {
		state.title = mutation.payload;
	}
};

export default mutations;
