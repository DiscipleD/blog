/**
 * Created by jack on 16-7-30.
 */

import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
} from 'graphql';

import Post from './Post';
import Tag from './Tag';
import PostService from '../../queries/PostService';
import TagService from '../../queries/TagService';

/**
 * type RootQueryType {
 *   post: Post,	// 查询一篇文章
 *   posts: [Post],	// 查询一组文章，用于博客首页
 *   tags: [Tag],	// 查询标签，用于博客标签页
 * }
 */
const rootQueryType = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		post: {
			type: Post,
			args: {
				name: {
					type: GraphQLString
				}
			},
			resolve: (blog, { name }) => PostService.getPostByName(name),
		},
		posts: {
			type: new GraphQLList(Post),
			resolve: () => PostService.queryPostsList(),
		},
		tags: {
			type: new GraphQLList(Tag),
			args: {
				name: {
					type: GraphQLString
				}
			},
			resolve: (blog, { name }) => !name ? TagService.queryTags() : [TagService.getTagByName(name)]
		}
	})
});

export default rootQueryType;
