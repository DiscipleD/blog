/**
 * Created by jack on 16-8-15.
 */

import mutations from './mutations';
import actions from './actions';

export default {
	state: {
		navList: [],
		navElementHeight: 0,
		bodyScrollTop: 0,
		isShown: false,
		isVisible: false,
		isFixed: false
	},
	getters: {
		navList: state => state.navList
	},
	actions,
	mutations
};
