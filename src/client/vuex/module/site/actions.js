/**
 * Created by jack on 16-8-16.
 */

import PostService from 'common/service/PostService';

import {createAction} from '../../common/actionHelper';
import {LOAD_NAV_LIST, LOAD_SOCIAL_LINK} from './mutation_types';
import SocialLinkSetting from './setting';

const loadNavList = ({commit}) => {
	return new PostService().getLatestPost()
		.then((result = {}) => {
			commit(createAction(LOAD_NAV_LIST, result.data.posts[0]));
		});
};

const loadSocialLink = ({commit}) => commit(createAction(LOAD_SOCIAL_LINK, SocialLinkSetting));

export default {loadNavList, loadSocialLink};
