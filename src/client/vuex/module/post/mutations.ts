/**
 * Created by jack on 16-8-16.
 */

import { IMutation } from '../../common/actionHelper';
import { PostState } from './index';
import { GET_POST, RECEIVE_POST } from './actions';

const mutations = {
	[GET_POST](state: PostState) {
		state.isLoading = true;
	},

	[RECEIVE_POST](state: PostState, mutation: IMutation) {
		state.isLoading = false;
		mutation && (state.post = mutation.payload.post);
	},
};

export default mutations;
