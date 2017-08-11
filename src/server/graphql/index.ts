/**
 * Created by jack on 16-7-30.
 */
import { GraphQLSchema } from 'graphql';

import query from './query';

const schema = new GraphQLSchema({
	query,
});

export default schema;
