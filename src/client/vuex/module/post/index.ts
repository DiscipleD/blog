/**
 * Created by jack on 16-8-15.
 */

import Post from 'types/post'; 
import mutations from './mutations';
import actions from './actions';

export class PostState {
	post: Post;
	isLoading: boolean;
	constructor() {
		this.isLoading = false;
	}
}

export default {
	state: new PostState(),
	actions,
	mutations
};
