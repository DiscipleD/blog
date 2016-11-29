/**
 * Created by jack on 16-4-26.
 */

import path from 'path';
import * as DataService from '../common/DataService';

import POSTS from './posts';
import TAGS from './tags';
import Post from '../model/Post';
import Tag from '../model/Tag';

const POST_DICTIONARY = path.join(__dirname, '/posts/');

const Data = {
	posts: {},
	tags: {}
};

// read .md file
Promise.all(POSTS.map(post => DataService.readMarkdownFile(POST_DICTIONARY + post.name + '.md')))
	.then(postContentList => POSTS.map((config, index) => new Post({
		...config,
		content: postContentList[index]
	})))
	.then(DataService.normalize)
	.then(posts => Object.assign(Data.posts, posts))
	.catch(console.error);

Object.assign(Data.tags, DataService.normalize(TAGS.map(tag => new Tag(tag))));

export default Data;
