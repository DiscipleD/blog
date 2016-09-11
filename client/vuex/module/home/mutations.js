/**
 * Created by jack on 16-8-16.
 */

import {INIT_HOME_PAGE, QUERY_POSTS_LIST, RECEIVE_POSTS_LIST} from './mutation_types';

export default {
	[INIT_HOME_PAGE](state = {}, mutation = {}) {
		state.header = mutation.payload.header;
	},

	[QUERY_POSTS_LIST](state = {}) {
		state.posts.isLoading = true;
	},

	[RECEIVE_POSTS_LIST](state = {}, mutation = {}) {
		if (mutation.payload.postsList.length) {
			state.posts.pager.number++;
		} else {
			state.posts.isFinished = true;
		}
		state.posts.list = state.posts.list.concat(mutation.payload.postsList);
		state.posts.isLoading = false;
	}
};
