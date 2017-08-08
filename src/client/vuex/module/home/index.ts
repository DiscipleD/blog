/**
 * Created by jack on 16-8-15.
 */

import { Title } from 'types/page'; 
import { Pager } from 'types/pager';
import Post from 'types/post'
import mutations from './mutations';
import actions from './actions';

export class HomeState {
	header: Title;
	posts: {
		list: Post[],
		pager: Pager,
		isFinished: boolean,
		isLoading: boolean
	};
	constructor() {
		this.posts = {
			isFinished: false,
			isLoading: false,
			list: [],
			pager: {
				number: -1,
				size: 5
			}
		}
	}
}

export default () => ({
	state: new HomeState(),
	getters: {
		posts: (state: HomeState) => state.posts
	},
	actions,
	mutations
});
