/**
 * Created by jack on 16-8-16.
 */

import { Store } from 'vuex';
 
import image from 'assets/img/home-bg.jpg';
import PostService from 'common/service/PostService';
import { createAction } from '../../common/actionHelper';
import { SET_BLOG_TITLE } from '../site/actions';

export const INIT_HOME_PAGE = 'INIT_HOME_PAGE';
export const QUERY_POSTS_LIST = 'QUERY_POSTS_LIST';
export const RECEIVE_POSTS_LIST = 'RECEIVE_POSTS_LIST';

const initHomePage = ({commit}: Store<any>) => {
	commit(createAction(SET_BLOG_TITLE));
	commit(createAction(INIT_HOME_PAGE, {
		header: {
			image,
			title: 'D.D Blog',
			subtitle: 'Share More, Gain More.'
		}
	}));
};

const loadPostList = ({state, commit}: Store<any>) => {
	// TODO Abstract whole page loading event
	if (process.env.VUE_ENV !== 'server') {
		commit(QUERY_POSTS_LIST);
	} else {
		state = state.home;
	}
	const pager = {
		...state.posts.pager,
		number: state.posts.pager.number + 1
	};
	return new PostService().queryPostList(pager)
		.then((result = {}) => {
			commit(createAction(RECEIVE_POSTS_LIST, {
				postsList: result.data.posts
			}));
		});
};


export default {initHomePage, loadPostList};
