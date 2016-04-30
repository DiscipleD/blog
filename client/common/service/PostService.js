/**
 * Created by jack on 16-4-27.
 */

import postList from '../../data/posts';

export default class PostService {
	constructor() {
	}

	queryPostList() {
		return Promise.resolve({ postList });
	}

	static queryPost(postName) {
		// tail call optimisation
		return new Promise((resolve, reject) => {
			let post;
			// using setTimeout to simulate call back end function
			setTimeout(() => {
				post = postList.filter(item => {
					return item.name === postName;
				});
				post.length ? resolve({post: post[0]}) : reject('Post not found.');
			}, 50);
		});
	}
}
