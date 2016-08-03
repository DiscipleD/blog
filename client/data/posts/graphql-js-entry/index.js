/**
 * Created by jack on 16-8-3.
 */

import Post from '../../../common/model/Post';

import content from './graphql-js-entry.md';

const post = new Post({
	name: 'graphql-js-entry',
	title: 'graphql-js 浅尝',
	subTitle: 'A JavaScript implementation for GraphQL',
	createdTime: '2016-08-03',
	tags: ['graphql', 'javascript', 'graphql-js'],
	content
});

export default post;
