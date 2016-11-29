/**
 * Created by jack on 16-8-15.
 */

import mutations from './mutations';
import actions from './actions';

export default {
	state: {
		header: {},
		posts: {
			list: [],
			pager: {
				number: -1,
				size: 5
			},
			isFinished: false,
			isLoading: false
		}
	},
	getters: {
		posts: state => state.posts
	},
	actions,
	mutations
};
