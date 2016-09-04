/**
 * Created by jack on 16-8-22.
 */

import Data from '../data';
import * as DataService from '../common/DataService';
import PostService from './PostService';

class TagService {
	constructor() {
		this.tags = Data.tags;
	}

	getTagByName(name = '') {
		return Object.values(this.tags).filter(tag => tag.name === name)[0] || {};
	}

	queryTags(){
		return Object.values(this.tags).sort(DataService.sortFn(object => PostService.queryPostsListByTagName(object.name).length, -1));
	}

	queryTagsByPostId(postId = 1) {
		return PostService.getPostById(postId).tags.map(name => this.getTagByName(name));
	}
}

export default new TagService();
