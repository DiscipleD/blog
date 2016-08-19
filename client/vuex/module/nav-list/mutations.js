/**
 * Created by jack on 16-8-16.
 */

import NavItem from 'common/model/NavItemClass';

import {LOAD_NAV_LIST} from './mutation_types';

const initNavList = () => {
	let navList = [];
	addNavItemToList(navList, new NavItem('home', 'Home', '/'));
	addNavItemToList(navList, new NavItem('aboutMe', 'About', '/about'));
	return navList;
};

const addNavItemToList = (list = [], {name = '', title = '', path = ''} = {}) => {
	list.push({name, title, path});
};

export default {
	[LOAD_NAV_LIST](state = {}, mutation = {}) {
		let navList = initNavList();
		addNavItemToList(navList, new NavItem('latestPost', 'Latest Post', '/posts/' + mutation.payload.name));
		state.navList = navList;
	}
};
