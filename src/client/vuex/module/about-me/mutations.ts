/**
 * Created by jack on 16-8-16.
 */

import { AboutMeState } from './index'; 
import { Mutation } from '../../common/actionHelper'; 
import { INIT_ABOUT_ME_PAGE } from './actions';

const mutation = {
	[INIT_ABOUT_ME_PAGE](state: AboutMeState, mutation: Mutation) {
		Object.assign(state, mutation.payload);
	}
};

export default mutation;
