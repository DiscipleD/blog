/**
 * Created by jack on 16-8-15.
 */

import mutations from './mutations';
import actions from './actions';

export default {
	state: {
		navList: [],
		socialLinkList: []
	},
	getters: {
		navList: state => state.navList,
		socialLinkList: state => state.socialLinkList
	},
	actions,
	mutations
};
