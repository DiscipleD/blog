/**
 * Created by jack on 16-8-16.
 */

import {GET_POST} from './mutation_types';

export default {
	[GET_POST](state = {}, mutation = {}) {
		state.post = mutation.payload.post;
	}
};
