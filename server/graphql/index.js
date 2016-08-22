/**
 * Created by jack on 16-7-30.
 */
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import BlogType from './blog';

const queryType = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		blog: {
			type: BlogType,
			resolve: () => ({})
		}
	})
});

const schema = new GraphQLSchema({
	query: queryType
});

export default schema;
