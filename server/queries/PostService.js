/**
 * Created by jack on 16-4-27.
 */

import Data from '../data';

class PostService {
	constructor() {}

	getPostById(id) {
		return Data.posts[id];
	}

	getPostByName(name){
		return Object.values(Data.posts).filter(post => post.name === name)[0] || {};
	}

	queryPostsList() {
		return Object.values(Data.posts);
	}

	queryPostsListByTagName(tagName = '') {
		return Object.values(Data.posts).filter(post => post.tags.indexOf(tagName) > -1);
	}
}

export default new PostService();
