/**
 * Created by jack on 16-8-22.
 */

import tags from '../data/tags';
import PostService from './PostService';

class TagService {
	constructor() {}

	getTagByName(name = '') {
		return Object.values(tags).filter(tag => tag.name === name)[0] || {};
	}

	queryTags(){
		return Object.values(tags);
	}

	queryTagsByPostId(postId = 1) {
		return PostService.getPostById(postId).tags.map(name => this.getTagByName(name).label);
	}
}

export default new TagService();
