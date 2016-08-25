/**
 * Created by jack on 16-4-27.
 */

import httpFetch, * as FetchService from './FetchService';

const GRAPHQL_URL_PREFIX = '/graphql';

export default class PostService {
	constructor() {}

	getLatestPost() {
		const GET_LATEST_POST_GRAPHQL = `query={blog{posts{id,name,createdDate,title,subtitle,headerImgName,tags{name,label}}}}`;
		return httpFetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, GET_LATEST_POST_GRAPHQL));
	}

	queryPostList() {
		const QUERY_POST_LIST_GRAPHQL = `query={blog{posts{id,name,createdDate,title,subtitle,tags{name,label}}}}`;
		return httpFetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, QUERY_POST_LIST_GRAPHQL));
	}

	getPostByName(postName) {
		const GET_POST_BY_NAME_GRAPHQL = `query={blog{post(name: "${postName}"){id,name,createdDate,title,subtitle,headerImgName,content,tags{name,label}}}}`;
		return httpFetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, GET_POST_BY_NAME_GRAPHQL));
	}
}
