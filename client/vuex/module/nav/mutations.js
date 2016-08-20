/**
 * Created by jack on 16-8-16.
 */

import NavItem from 'common/model/NavItemClass';

import {LOAD_NAV_LIST, INIT_NAV_ELEMENT, BODY_SCROLL_LISTENER_OF_NAV, TOGGLE_NAV_SHOWN} from './mutation_types';

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
	},

	[INIT_NAV_ELEMENT](state = {}, mutation = {}) {
		state.navElementHeight = mutation.payload.height;
		state.isShown = mutation.payload.isDesktop;
	},

	[BODY_SCROLL_LISTENER_OF_NAV](state = {}, mutation = {}) {
		const currentTop = mutation.payload;

		// check if user is scrolling up
		if (currentTop < state.bodyScrollTop) {
			// if scrolling up...
			if (currentTop > 0 && state.isFixed) {
				state.isVisible = true;
			} else {
				state.isVisible = false;
				state.isFixed = false;
			}
		} else if (currentTop > state.bodyScrollTop) {
			// if scrolling down...
			state.isVisible = false;
			currentTop > state.navElementHeight && (state.isFixed = true);
		}
		state.bodyScrollTop = currentTop;
	},

	[TOGGLE_NAV_SHOWN](state = {}) {
		state.isShown = !state.isShown;
	}
};
