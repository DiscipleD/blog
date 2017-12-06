/**
 * Created by jack on 16-4-26.
 */

import path = require('path');
import * as DataService from '../common/DataService';

import Post, { IPostBase } from '../../types/post';
import Tag, { ITagBase } from '../../types/tag';
import POSTS from './posts';
import TAGS from './tags';

interface IData {
	posts: {
		[key: string]: Post,
	};
	tags: {
		[key: string]: Tag,
	};
}

const POST_DICTIONARY = path.join(__dirname, '/posts/');

const Data: IData = {
	posts: {},
	tags: DataService.normalize(TAGS.map((tag: ITagBase, index: number) => new Tag({ ...tag, id: index }))),
};

// read .md file
Promise.all(POSTS.map((post: IPostBase) => DataService.readMarkdownFile(POST_DICTIONARY + post.name + '.md')))
	.then((postContentList: string[]) =>
		POSTS.map((config, index) =>
			new Post({
				...config,
				id: index,
				content: postContentList[index],
			})))
	.then(DataService.normalize)
	.then((posts) => Object.assign(Data.posts, posts))
	.catch(console.error);

export default Data;
