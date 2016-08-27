/**
 * Created by jack on 16-8-27.
 */

import httpFetch, * as FetchService from './FetchService';

const GRAPHQL_URL_PREFIX = '/graphql';

class TagService {
	constructor() {}

	queryTagsList(tagName = '') {
		const QUERY_POST_LIST_GRAPHQL = `query={blog{tags(name: "${tagName}"){id,name,createdDate,label,posts{name,title}}}}`;
		return httpFetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, QUERY_POST_LIST_GRAPHQL));
	}
}

export default new TagService();
