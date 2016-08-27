/**
 * Created by jack on 16-8-27.
 */

import TagService from 'common/service/TagService';

import image from 'assets/img/tags-bg.jpg';
import {createAction} from '../../common/actionHelper';
import {INIT_TAGS_PAGE, QUERY_TAGS} from './mutation_types';

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
	TagService.queryTagsList(tagName)
		.then(result => {
			if (result.data.blog.tags && result.data.blog.tags.length > 0) {
				return result.data.blog;
			} else {
				throw new Error('Tag not found!');
			}
		})
		.then(blog => commit(createAction(QUERY_TAGS, blog)))
		.catch(err => {
			console.error(err + ' Page will redirect to the Home page.');
			router.replace('/');
		});
};

export default {initTagsPage, queryTagsList};
