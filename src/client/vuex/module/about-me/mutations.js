/**
 * Created by jack on 16-8-16.
 */

import {INIT_ABOUT_ME_PAGE} from './mutation_types';

export default {
	[INIT_ABOUT_ME_PAGE](state = {}, mutation = {}) {
		Object.assign(state, mutation.payload);
	}
};
