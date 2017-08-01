/**
 * Created by jack on 16-8-20.
 */

import mutations from './mutations';
import actions from './actions';

export class BrowserState {
	clientWidth: number;
	constructor() {
		this.clientWidth = 0;
	}
}

const MIN_SCREEN_WIDTH: number = 768;

export default {
	state: new BrowserState(),
	getters: {
		isDesktop: (state: BrowserState) => state.clientWidth >= MIN_SCREEN_WIDTH
	},
	actions,
	mutations
};

