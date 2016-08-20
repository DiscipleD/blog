/**
 * Created by jack on 16-8-16.
 */

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import {LOAD_NAV_LIST, INIT_NAV_ELEMENT, BODY_SCROLL_LISTENER_OF_NAV, TOGGLE_NAV_SHOWN} from './mutation_types';

const loadNavList = ({commit}) => {
	new PostService().queryPostList()
		.then((result = {}) => {
			commit(createAction(LOAD_NAV_LIST, result.postList[0]));
		});
};

const initNavContainer = ({commit}, isDesktop) => {
	const height = document.querySelector('.navbar-custom').clientHeight;
	commit(createAction(INIT_NAV_ELEMENT, {
		height,
		isDesktop
	}));
};

const bodyScrollListenerOfNav = ({commit}) => commit(createAction(BODY_SCROLL_LISTENER_OF_NAV, document.body.scrollTop));

const toggleNavShown = ({commit}) => commit(createAction(TOGGLE_NAV_SHOWN));

export default {loadNavList, initNavContainer, bodyScrollListenerOfNav, toggleNavShown};
