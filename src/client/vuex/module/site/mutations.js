/**
 * Created by jack on 16-8-16.
 */

import svgPath from './social-link.svg';
import NavItem from 'common/model/NavItemClass';
import {LOAD_NAV_LIST, LOAD_SOCIAL_LINK, SET_BLOG_TITLE} from './mutation_types';
import { isSupportShareAPI, sharePage } from 'common/service/CommonService';

const initNavList = () => {
	let navList = [];
	navList.push(new NavItem('home', 'Home', '/'));
	navList.push(new NavItem('aboutMe', 'About', '/about'));
	navList.push(new NavItem('tags', 'Tags', '/tags'));
	isSupportShareAPI() && navList.push(new NavItem('share', 'Share', '', sharePage));
	return navList;
};

export default {
	[LOAD_NAV_LIST](state = {}, mutation = {}) {
		const navList = initNavList();
		navList.push(new NavItem('latestPost', 'Latest Post', '/posts/' + mutation.payload.name));
		state.navList = navList;
	},

	[LOAD_SOCIAL_LINK](state = {}, mutation = {}) {
		state.socialLinkList = mutation.payload
			.filter(item => !!item.link)
			.map(item => ({
				...item,
				svgPath: svgPath + '#' + item.name
			}));
	},

	[SET_BLOG_TITLE](state = {}, mutation = {}) {
		state.title = mutation.payload;
	}
};
