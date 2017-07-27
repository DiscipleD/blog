/**
 * Created by jack on 16-8-15.
 */

import Post from 'types/post'; 
import mutations from './mutations';
import actions from './actions';

export interface PostState {
	post: Post,
	isLoading: boolean
}

export default {
	state: {
		post: {},
		isLoading: false
	},
	actions,
	mutations
};
