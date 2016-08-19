/**
 * Created by jack on 16-8-15.
 */

import mutations from './mutations';
import {loadNavList} from './actions';

export default {
	state: {
		navList: []
	},
	actions: {
		loadNavList
	},
	getters: {
		navList: state => state.navList
	},
	mutations
};
