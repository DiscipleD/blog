/**
 * Created by jack on 16-8-16.
 */

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import {INIT_HOME_PAGE, LOAD_POST_LIST} from './mutation_types';
import image from 'assets/img/home-bg.jpg';

const initHomePage = ({dispatch, commit}) => {
	commit(createAction(INIT_HOME_PAGE, {
		header: {
			image,
			title: 'D.D Blog',
			subtitle: 'Share More, Gain More.'
		}
	}));
	dispatch('loadPostList');
};

const loadPostList = ({commit}) => {
	new PostService().queryPostList()
		.then((result = {}) => {
			commit(createAction(LOAD_POST_LIST, {
				postsList: result.postsList
			}));
		});
};

export default {initHomePage, loadPostList};
