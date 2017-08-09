/**
 * Created by jack on 16-8-16.
 */

import { AboutMeState } from './index';
import { IMutation } from '../../common/actionHelper';
import { INIT_ABOUT_ME_PAGE } from './actions';

const mutations = {
	[INIT_ABOUT_ME_PAGE](state: AboutMeState, mutation: IMutation) {
		Object.assign(state, mutation.payload);
	},
};

export default mutations;
