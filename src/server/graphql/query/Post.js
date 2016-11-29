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

import Tag from './Tag';
import PostService from '../../queries/PostService';
import TagService from '../../queries/TagService';

/**
 * type Post {
 *   id: String!,
 *   name: String!,
 *   createdDate: String,
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
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		createdDate: {
			type: GraphQLString
		},
		title: {
			type: new GraphQLNonNull(GraphQLString)
		},
		subtitle: {
			type: GraphQLString
		},
		headerImgName: {
			type: GraphQLString
		},
		content: {
			type: GraphQLString
		},
		prevPost: {
			type: Post,
			resolve: post => PostService.getPreviousPost(post.id)
		},
		nextPost: {
			type: Post,
			resolve: post => PostService.getNextPost(post.id)
		},
		tags: {
			type: new GraphQLList(Tag),
			resolve: post => TagService.queryTagsByPostId(post.id)
		}
	})
});

export default Post;
