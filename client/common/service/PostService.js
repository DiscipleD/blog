/**
 * Created by jack on 16-4-27.
 */

import * as FetchService from './FetchService';

const GRAPHQL_URL_PREFIX = '/graphql';

export default class PostService {
	constructor() {}

	getLatestPost() {
		const GET_LATEST_POST_GRAPHQL = `query={blog{posts{id,name,createdDate,title,subtitle,headerImgName,tags{name,label}}}}`;
		return fetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, GET_LATEST_POST_GRAPHQL))
			.then(FetchService.status)
			.then(FetchService.json);
	}

	queryPostList() {
		const QUERY_POST_LIST_GRAPHQL = `query={blog{posts{id,name,createdDate,title,subtitle,tags{name,label}}}}`;
		return fetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, QUERY_POST_LIST_GRAPHQL))
			.then(FetchService.status)
			.then(FetchService.json);
	}

	getPostByName(postName) {
		const GET_POST_BY_NAME_GRAPHQL = `query={blog{post(name: "${postName}"){id,name,createdDate,title,subtitle,headerImgName,content,tags{name,label}}}}`;
		return fetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, GET_POST_BY_NAME_GRAPHQL))
			.then(FetchService.status)
			.then(FetchService.json);
	}
}
