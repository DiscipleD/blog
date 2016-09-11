/**
 * Created by jack on 16-8-27.
 */

import TagService from 'common/service/TagService';

import image from 'assets/img/tags-bg.jpg';
import {createAction} from '../../common/actionHelper';
import {INIT_TAGS_PAGE, QUERY_TAGS, RECEIVE_TAGS} from './mutation_types';

const initTagsPage = ({commit}) => {
	commit(createAction(INIT_TAGS_PAGE, {
		header: {
			image,
			title: 'Tag',
			subtitle: ''
		}
	}));
};

const queryTagsList = ({commit}, {tagName, router}) => {
	commit(QUERY_TAGS);
	TagService.queryTagsList(tagName)
		.then(result => {
			if (result.data.tags && result.data.tags.length > 0) {
				return result.data;
			} else {
				throw new Error('Tag not found!');
			}
		})
		.then(blog => commit(createAction(RECEIVE_TAGS, blog)))
		.catch(err => {
			commit(createAction(RECEIVE_TAGS));
			console.error(err + ' Page will redirect to the Home page.');
			router.replace('/');
		});
};

export default {initTagsPage, queryTagsList};
