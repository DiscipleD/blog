/**
 * Created by jack on 16-8-16.
 */

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import {LOAD_NAV_LIST, INIT_NAV_ELEMENT, BODY_SCROLL_LISTENER_OF_NAV} from './mutation_types';

const loadNavList = ({commit}) => {
	new PostService().getLatestPost()
		.then((result = {}) => {
			commit(createAction(LOAD_NAV_LIST, result.data.posts[0]));
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

export default {loadNavList, initNavContainer, bodyScrollListenerOfNav};
