/**
 * Created by jack on 16-8-20.
 */

import {LOAD_BROWSER_SETTING} from './mutation_types';

export default {
	[LOAD_BROWSER_SETTING](state = {}, mutation = {}) {
		state.clientWidth = mutation.payload.clientWidth;
	}
};
