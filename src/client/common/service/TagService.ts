/**
 * Created by jack on 16-8-27.
 */

import httpFetch, * as FetchService from './FetchService';

import { ITagPage } from 'types/tag';

export interface IQueryTagsResponse {
	tags: ITagPage[];
}

const GRAPHQL_URL_PREFIX = '/graphql';

class TagService {
	constructor() {}

	public queryTagsList(tagName = ''): Promise<GraphQLResponse<IQueryTagsResponse>> {
		const QUERY_POST_LIST_GRAPHQL = `query={tags(name: "${tagName}"){id,name,createdTime,label,posts{name,title}}}`;
		return httpFetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, QUERY_POST_LIST_GRAPHQL));
	}
}

export default new TagService();
