/**
 * Created by jack on 16-8-16.
 */

import {INIT_HOME_PAGE, LOAD_POST_LIST} from './mutation_types';

export default {
	[INIT_HOME_PAGE](state = {}, mutation = {}) {
		state.header = mutation.payload.header;
	},

	[LOAD_POST_LIST](state = {}, mutation = {}) {
		state.postsList = mutation.payload.postsList;
	}
};
