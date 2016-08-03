/**
 * Created by jack on 16-8-1.
 */

import Post from '../../../common/model/Post';

import content from './graphql-core-concepts.md';

const post = new Post({
	name: 'graphql-core-concepts',
	title: 'GraphQL 核心概念',
	subTitle: 'A query language created by Facebook for decribing data requirements on complex application data models',
	createdTime: '2016-08-01',
	tags: ['graphql'],
	content
});

export default post;
