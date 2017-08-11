/**
 * Created by jack on 16-8-27.
 */
import { ActionContext } from 'vuex';
import VueRouter from 'vue-router';

import TagService, { IQueryTagsResponse } from 'common/service/TagService';
import image from 'assets/img/tags-bg.jpg';
import { createAction } from '../../common/actionHelper';
import { IRootState } from '../index';
import { TagsState } from './index';
import { SET_BLOG_TITLE } from '../site/actions';

export interface ITagQueryParam {
	tagName: string;
	router: VueRouter;
	enableLoading?: boolean;
}

export const INIT_TAGS_PAGE = 'INIT_TAGS_PAGE';
export const QUERY_TAGS = 'QUERY_TAGS';
export const RECEIVE_TAGS = 'RECEIVE_TAGS';

const initTagsPage = ({ commit }: ActionContext<TagsState, IRootState>) => {
	commit(createAction(INIT_TAGS_PAGE, {
		header: {
			image,
			title: 'Tags',
			subtitle: '',
		},
	}));
};

const queryTagsList =
	({ commit }: ActionContext<TagsState, IRootState>, { tagName, router, enableLoading = true }: ITagQueryParam) => {
		enableLoading && commit(QUERY_TAGS);
		return TagService.queryTagsList(tagName)
			.then((result: GraphQLResponse<IQueryTagsResponse>) => {
				if (result.data && result.data.tags && result.data.tags.length > 0) {
					return result.data;
				} else {
					throw new Error('Tag not found!');
				}
			})
			.then((data: IQueryTagsResponse) => {
				commit(createAction(RECEIVE_TAGS, data));
				commit(createAction(SET_BLOG_TITLE, data.tags.length === 1 ? data.tags[0].label : 'Tags'));
			})
			.catch((err: Error) => {
				commit(createAction(RECEIVE_TAGS));
				console.error(err + ' Page will redirect to the Home page.');
				router.replace('/');
			});
	};

export default { initTagsPage, queryTagsList };
