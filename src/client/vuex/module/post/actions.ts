/**
 * Created by jack on 16-8-16.
 */

import { ActionContext, Store } from 'vuex';
import VueRouter from 'vue-router';

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import { RootState } from '../index';
import { PostState } from './index';
import { SET_BLOG_TITLE } from '../site/actions';

export const GET_POST = 'GET_POST';
export const RECEIVE_POST = 'RECEIVE_POST';

export interface PostQueryParam {
	postName: string,
	router?: VueRouter,
	enableLoading?: boolean
}

const getPost = ({commit}: ActionContext<PostState, RootState>, {postName, enableLoading = true, router}: PostQueryParam) => {
	enableLoading && commit(GET_POST);
	return new PostService().getPostByName(postName)
		.then(result => {
			if (result.data && result.data.post) {
				return result.data;
			} else {
				throw new Error('Post not found!');
			}
		})
		.then(blog => {
			commit(createAction(RECEIVE_POST, blog));
			commit(createAction(SET_BLOG_TITLE, blog.post.title));
		})
		.catch(err => {
			commit(RECEIVE_POST);
			console.error(err + ' Page will redirect to the Home page.');
			router && router.replace('/');
		});
};

export default {getPost};
