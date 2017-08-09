/**
 * Created by jack on 16-8-20.
 */

import mutations from './mutations';
import actions from './actions';

const MIN_SCREEN_WIDTH = 768;

export default () => ({
	state: {
		clientWidth: 0
	},
	getters: {
		isDesktop: state => state.clientWidth >= MIN_SCREEN_WIDTH
	},
	actions,
	mutations
});

