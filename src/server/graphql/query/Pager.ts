/**
 * Created by jack on 16-9-11.
 */

import {
	GraphQLInputObjectType,
	GraphQLFloat,
} from 'graphql';

/**
 * type Pager {
 *   pageNumber: Number,
 *   pageSize: Number
 * }
 */
const Pager = new GraphQLInputObjectType({
	name: 'PagerInputType',
	fields: {
		number: {
			type: GraphQLFloat,
			defaultValue: 0,
		},
		size: {
			type: GraphQLFloat,
			defaultValue: 5,
		},
	},
});

export default Pager;
