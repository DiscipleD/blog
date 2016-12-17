/**
 * Created by jack on 16-8-16.
 */

import svgPath from './social-link.svg';
import NavItem from 'common/model/NavItemClass';
import {LOAD_NAV_LIST, LOAD_SOCIAL_LINK, SET_BLOG_TITLE} from './mutation_types';

const initNavList = () => {
	let navList = [];
	addNavItemToList(navList, new NavItem('home', 'Home', '/'));
	addNavItemToList(navList, new NavItem('aboutMe', 'About', '/about'));
	addNavItemToList(navList, new NavItem('tags', 'Tags', '/tags'));
	return navList;
};

const addNavItemToList = (list = [], {name = '', title = '', path = ''} = {}) => {
	list.push({name, title, path});
};

export default {
	[LOAD_NAV_LIST](state = {}, mutation = {}) {
		const navList = initNavList();
		addNavItemToList(navList, new NavItem('latestPost', 'Latest Post', '/posts/' + mutation.payload.name));
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
