/**
 * Created by jack on 16-8-16.
 */

import {GET_POST, RECEIVE_POST} from './mutation_types';

export default {
	[GET_POST](state = {}) {
		state.isLoading = true;
	},

	[RECEIVE_POST](state = {}, mutation) {
		state.isLoading = false;
		mutation && (state.post = mutation.payload.post);
	}
};
