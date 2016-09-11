/**
 * Created by jack on 16-8-16.
 */

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import {GET_POST, RECEIVE_POST} from './mutation_types';

const getPost = ({commit}, {postName, router}) => {
	commit(GET_POST);
	new PostService().getPostByName(postName)
		.then(result => {
			if (result.data && result.data.post) {
				return result.data;
			} else {
				throw new Error('Post not found!');
			}
		})
		.then(blog => commit(createAction(RECEIVE_POST, blog)))
		.catch(err => {
			commit(RECEIVE_POST);
			console.error(err + ' Page will redirect to the Home page.');
			router.replace('/');
		});
};

export default {getPost};
