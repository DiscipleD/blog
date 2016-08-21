/**
 * Created by jack on 16-8-16.
 */

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import {GET_POST} from './mutation_types';

const getPost = ({commit}, {postName, router}) => {
	new PostService().queryPost(postName)
		.then(data => commit(createAction(GET_POST, data)))
		.catch(err => {
			console.error(err + 'Page will redirect to the Home page.');
			router.replace('/');
		});
};

export default {getPost};
