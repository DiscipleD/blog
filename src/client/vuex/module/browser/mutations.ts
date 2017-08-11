/**
 * Created by jack on 16-8-20.
 */

import { BrowserState } from './index';
import { IMutation } from '../../common/actionHelper';
import { LOAD_BROWSER_SETTING } from './actions';

const mutations = {
	[LOAD_BROWSER_SETTING](state: BrowserState, mutation: IMutation) {
		state.clientWidth = mutation.payload.clientWidth;
	},
};

export default mutations;
