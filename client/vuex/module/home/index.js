/**
 * Created by jack on 16-8-15.
 */

import mutations from './mutations';
import actions from './actions';

export default {
	state: {
		header: {},
		postsList: []
	},
	getters: {
		postsList: state => state.postsList
	},
	actions,
	mutations
};
