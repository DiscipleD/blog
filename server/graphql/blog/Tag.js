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

import PostType from './Post';
import PostService from '../../queries/PostService';
import {sortFn} from '../../common/DataService';

/**
 * type Tag {
 *   id: ID!,
 *   name: String!,
 *   label: String!,
 *   createDate: String,
 *   posts: [Post]
 * }
 */
const Tag = new GraphQLObjectType({
	name: 'TagType',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		label: {
			type: new GraphQLNonNull(GraphQLString)
		},
		createdDate: {
			type: GraphQLString
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve: tag => PostService.queryPostsListByTagName(tag.name).sort(sortFn('createdDate'))
		}
	})
});

export default Tag;
