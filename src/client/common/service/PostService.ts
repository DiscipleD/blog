/**
 * Created by jack on 16-4-27.
 */

import httpFetch, * as FetchService from './FetchService';
import { IPostPage } from 'types/post';
import { IPager } from 'types/pager';

export interface IQueryPostsResponse {
	posts: IPostPage[];
}

export interface IQueryPostResponse {
	post: IPostPage;
}

const GRAPHQL_URL_PREFIX = '/graphql';

export default class PostService {
	constructor() {}

	public getLatestPost(): Promise<GraphQLResponse<IQueryPostsResponse>> {
		const GET_LATEST_POST_GRAPHQL =
		 `query={posts(pager:{number:0,size:1}){id,name,createdTime,title,subtitle,headerImgName,tags{name,label}}}`;
		return httpFetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, GET_LATEST_POST_GRAPHQL));
	}

	public queryPostList({ num = 0, size = 5 }: IPager): Promise<GraphQLResponse<IQueryPostsResponse>> {
		const QUERY_POST_LIST_GRAPHQL =
			`query={posts(pager:{number:${num},size:${size}}){id,name,createdTime,title,subtitle,tags{name,label}}}`;
		return httpFetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, QUERY_POST_LIST_GRAPHQL));
	}

	public getPostByName(postName: string): Promise<GraphQLResponse<IQueryPostResponse>> {
		const GET_POST_BY_NAME_GRAPHQL = `query={post(name: "${postName}"){id,name,createdTime,title,subtitle,headerImgName,
			content,prevPost{name,title},nextPost{name,title},tags{name,label}}}`;
		return httpFetch(FetchService.generatorUrl(GRAPHQL_URL_PREFIX, GET_POST_BY_NAME_GRAPHQL));
	}
}
