/**
 * Created by jack on 16-4-27.
 */

import Post from '../../types/post';
import Data from '../data';
import * as DataService from '../common/DataService';

class PostService {
	public posts: { [key: string]: Post };
	constructor() {
		this.posts = Data.posts;
	}

	public getPostById(id: string) {
		return this.posts[id];
	}

	public getPostByName(name: string) {
		return Object.values(this.posts).filter((post: Post) => post.name === name)[0];
	}

	public getPreviousPost(id: number) {
		return id > 0 ? this.getPostById(`${id - 1}`) : null;
	}

	public getNextPost(id: number) {
		return id < Object.keys(this.posts).length - 1 ? this.getPostById(`${id - 1}`) : null;
	}

	public queryPostsList({number: pageNumber = 0, size: pageSize = 5} = {}) {
		const postsList = Object.values(this.posts).sort(DataService.sortFn('createdDate', -1));
		const startIndex = pageNumber * pageSize;
		const endIndex = startIndex + pageSize > postsList.length ? postsList.length : startIndex + pageSize;
		return postsList.slice(startIndex, endIndex);
	}

	public queryPostsListByTagName(tagName = '') {
		return Object.values(this.posts).filter((post: Post) => post.tags.indexOf(tagName) > -1);
	}
}

export default new PostService();
