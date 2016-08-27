/**
 * Created by jack on 16-8-16.
 */

import {INIT_TAGS_PAGE, QUERY_TAGS} from './mutation_types';

export default {
	[INIT_TAGS_PAGE](state = {}, mutation = {}) {
		Object.assign(state, mutation.payload);
	},

	[QUERY_TAGS](state = {}, mutation = {}) {
		state.tagsList = mutation.payload.tags;
	}
};
