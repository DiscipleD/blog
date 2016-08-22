/**
 * Created by jack on 16-4-27.
 */

import posts from '../data/posts';

class PostService {
	constructor() {}

	getPostById(id) {
		return posts[id];
	}

	getPostByName(name){
		return Object.values(posts).filter(post => post.name === name)[0] || {};
	}

	queryPostsList() {
		return Object.values(posts);
	}

	queryPostsListByTagName(tagName = '') {
		return Object.keys(posts).filter(id => !~posts[id].tags.indexOf(tagName));
	}
}

export default new PostService();
