/**
 * Created by jack on 16-8-15.
 */

import { Title } from 'types/page'; 
import { Pager } from 'types/pager';
import Post from 'types/post'
import mutations from './mutations';
import actions from './actions';

export interface HomeState {
	header: Title,
	posts: {
		list: Post[],
		pager: Pager,
		isFinished: boolean,
		isLoading: boolean
	}
}

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
		posts: (state: HomeState) => state.posts
	},
	actions,
	mutations
};
