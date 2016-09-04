/**
 * Created by jack on 16-4-27.
 */

import Data from '../data';
import * as DataService from '../common/DataService';

class PostService {
	constructor() {
		this.posts = Data.posts;
	}

	getPostById(id) {
		return this.posts[id];
	}

	getPostByName(name) {
		return Object.values(this.posts).filter(post => post.name === name)[0];
	}

	getPreviousPost(id) {
		return id > 0 ? this.getPostById(id - 1) : null;
	}

	getNextPost(id) {
		return id < Object.keys(this.posts).length - 1 ? this.getPostById(id + 1) : null;
	}

	queryPostsList() {
		return Object.values(this.posts).sort(DataService.sortFn('createdDate', -1));
	}

	queryPostsListByTagName(tagName = '') {
		return Object.values(this.posts).filter(post => post.tags.indexOf(tagName) > -1);
	}
}

export default new PostService();
