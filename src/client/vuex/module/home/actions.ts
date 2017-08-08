/**
 * Created by jack on 16-8-16.
 */

import { ActionContext } from 'vuex';
 
import image from 'assets/img/home-bg.jpg';
import PostService from 'common/service/PostService';
import { createAction } from '../../common/actionHelper';
import { RootState } from '../index';
import { HomeState } from './index';
import { SET_BLOG_TITLE } from '../site/actions';

export const INIT_HOME_PAGE = 'INIT_HOME_PAGE';
export const QUERY_POSTS_LIST = 'QUERY_POSTS_LIST';
export const RECEIVE_POSTS_LIST = 'RECEIVE_POSTS_LIST';

const initHomePage = ({commit}: ActionContext<HomeState, RootState>) => {
	commit(createAction(SET_BLOG_TITLE));
	commit(createAction(INIT_HOME_PAGE, {
		header: {
			image,
			title: 'D.D Blog',
			subtitle: 'Share More, Gain More.'
		}
	}));
};

const loadPostList = ({state, commit}: ActionContext<HomeState, RootState>) => {
	commit(QUERY_POSTS_LIST);
	const pager = {
		...state.posts.pager,
		number: state.posts.pager.number + 1
	};
	return new PostService().queryPostList(pager)
		.then((result = {}) => {
			commit(createAction(RECEIVE_POSTS_LIST, {
				postsList: result.data ? result.data.posts : []
			}));
		});
};

export default {initHomePage, loadPostList};
