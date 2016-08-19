/**
 * Created by jack on 16-8-16.
 */

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import {LOAD_NAV_LIST} from './mutation_types';

const loadNavList = ({commit}) => {
	new PostService().queryPostList()
		.then((result = {}) => {
			commit(createAction(LOAD_NAV_LIST, result.postList[0]));
		});
};

export {loadNavList};
