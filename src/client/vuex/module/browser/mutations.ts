/**
 * Created by jack on 16-8-20.
 */

import { BrowserState } from './index'; 
import { Mutation } from '../../common/actionHelper'; 
import { LOAD_BROWSER_SETTING } from './actions';

const mutation = {
	[LOAD_BROWSER_SETTING](state: BrowserState, mutation: Mutation) {
		state.clientWidth = mutation.payload.clientWidth;
	}
};

export default mutation;
