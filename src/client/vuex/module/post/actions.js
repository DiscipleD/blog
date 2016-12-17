/**
 * Created by jack on 16-8-16.
 */

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import { SET_BLOG_TITLE } from '../site/mutation_types';
import {GET_POST, RECEIVE_POST} from './mutation_types';

const getPost = ({commit}, {postName, enableLoading = true, router}) => {
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
			router.replace('/');
		});
};

export default {getPost};
