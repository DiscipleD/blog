/**
 * Created by jack on 16-8-22.
 */

import Tag from '../../types/tag';
import Data from '../data';
import * as DataService from '../common/DataService';
import PostService from './PostService';

class TagService {
	public tags: { [key: string]: Tag };
	constructor() {
		this.tags = Data.tags;
	}

	public getTagByName(name: string) {
		return Object.values(this.tags).filter((tag: Tag) => tag.name === name)[0] || {};
	}

	public queryTags() {
		return Object
			.values(this.tags)
			.sort(DataService.sortFn((tag: Tag) => PostService.queryPostsListByTagName(tag.name).length, -1));
	}

	public queryTagsByPostId(postId = 1) {
		return PostService.getPostById(`${postId}`).tags.map((name: string) => this.getTagByName(name));
	}
}

export default new TagService();
