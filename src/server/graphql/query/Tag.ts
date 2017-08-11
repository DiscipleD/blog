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

import Tag from '../../../types/tag';
import PostType from './Post';
import PostService from '../../queries/PostService';
import { sortFn } from '../../common/DataService';

/**
 * type Tag {
 *   id: ID!,
 *   name: String!,
 *   label: String!,
 *   createdTime: String,
 *   posts: [Post]
 * }
 */
export default new GraphQLObjectType({
	name: 'TagType',
	fields: (): any => ({
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		label: {
			type: new GraphQLNonNull(GraphQLString),
		},
		createdTime: {
			type: GraphQLString,
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve: (tag: Tag) => PostService.queryPostsListByTagName(tag.name).sort(sortFn('createdTime', -1)),
		},
	}),
});
