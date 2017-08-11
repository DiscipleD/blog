/**
 * Created by jack on 16-8-16.
 */

import { TagsState } from './index';
import { IMutation } from '../../common/actionHelper';
import { INIT_TAGS_PAGE, QUERY_TAGS, RECEIVE_TAGS } from './actions';

const mutations = {
	[INIT_TAGS_PAGE](state: TagsState, mutation: IMutation) {
		Object.assign(state, mutation.payload);
	},

	[QUERY_TAGS](state: TagsState) {
		state.isLoading = true;
	},

	[RECEIVE_TAGS](state: TagsState, mutation: IMutation) {
		state.isLoading = false;
		mutation && (state.list = mutation.payload.tags);
	},
};

export default mutations;
