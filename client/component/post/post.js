/**
 * Created by jack on 16-4-27.
 */

import posts from '../../app/posts';

export default class Post {
	constructor() {
		this.title = '';
		this.subTitle = '';
		this.createdTime = '';
		this.content = '';
		this.headerImg = '';
	}

	queryPost(postName) {
		if (postName && posts[postName]) {
			this.title = postName;
			this.content = posts[postName];
		}
	}
}
