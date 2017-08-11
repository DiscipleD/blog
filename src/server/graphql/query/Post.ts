/**
 * Created by jack on 16-7-30.
 */

import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLNonNull,
	GraphQLList,
} from 'graphql';

import PostType from '../../../types/post';
import Tag from './Tag';
import PostService from '../../queries/PostService';
import TagService from '../../queries/TagService';

/**
 * type Post {
 *   id: String!,
 *   name: String!,
 *   createdTime: String,
 *   title: String!,
 *   subtitle: String,
 *   headerImgName: String,
 *   content: String,
 *   prevPost: Post,
 *   nextPost: Post,
 *   tags: [Tag]
 * }
 */
const Post = new GraphQLObjectType({
	name: 'PostType',
	fields: (): any => ({
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		createdTime: {
			type: GraphQLString,
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
		},
		subtitle: {
			type: GraphQLString,
		},
		headerImgName: {
			type: GraphQLString,
		},
		content: {
			type: GraphQLString,
		},
		prevPost: {
			type: Post,
			resolve: (post: PostType) => PostService.getPreviousPost(post.id),
		},
		nextPost: {
			type: Post,
			resolve: (post: PostType) => PostService.getNextPost(post.id),
		},
		tags: {
			type: new GraphQLList(Tag),
			resolve: (post: PostType) => TagService.queryTagsByPostId(post.id),
		},
	}),
});

export default Post;
