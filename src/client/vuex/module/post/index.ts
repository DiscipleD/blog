/**
 * Created by jack on 16-8-15.
 */

import Post from '../../../../types/post'; // ts module bug, it should work well with 'types/post', but not
import mutations from './mutations';
import actions from './actions';

export class PostState {
	post: Post;
	isLoading: boolean;
	constructor() {
		this.isLoading = false;
		this.post = new Post();
	}
}

export default () => ({
	state: new PostState(),
	actions,
	mutations
});
