/**
 * Created by jack on 16-8-20.
 */

import mutations from './mutations';
import actions from './actions';

export interface BrowserState {
	clientWidth: number
}

const MIN_SCREEN_WIDTH: number = 768;

export default {
	state: {
		clientWidth: 0
	},
	getters: {
		isDesktop: (state: BrowserState) => state.clientWidth >= MIN_SCREEN_WIDTH
	},
	actions,
	mutations
};

