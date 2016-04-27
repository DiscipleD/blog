/**
 * Created by jack on 16-4-27.
 */

import posts from '../../app/posts';

export default class PostService {
	constructor() {

	}

	static queryPost(postName) {
		let post;
		if (postName) {
			post = posts.filter(item => {
				return item.name === postName;
			});
			post = post.length ? post[0] : '';
		}
		return post;
	}
}
