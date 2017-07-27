/**
 * Created by jack on 16-8-16.
 */

import { HomeState } from './index';
import { Mutation } from '../../common/actionHelper';
import { INIT_HOME_PAGE, QUERY_POSTS_LIST, RECEIVE_POSTS_LIST } from './actions';

const mutation = {
	[INIT_HOME_PAGE](state: HomeState, mutation: Mutation) {
		state.header = mutation.payload.header;
	},

	[QUERY_POSTS_LIST](state: HomeState) {
		state.posts.isLoading = true;
	},

	[RECEIVE_POSTS_LIST](state: HomeState, mutation: Mutation) {
		if (mutation.payload.postsList.length) {
			state.posts.pager.number++;
		} else {
			state.posts.isFinished = true;
		}
		state.posts.list = state.posts.list.concat(mutation.payload.postsList);
		state.posts.isLoading = false;
	}
};

export default mutation;
