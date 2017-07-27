/**
 * Created by jack on 16-8-16.
 */

import { Store } from 'vuex';

import PostService from 'common/service/PostService';
import {createAction} from '../../common/actionHelper';
import SocialLinkSetting from './setting';

export const LOAD_NAV_LIST = 'LOAD_NAV_LIST';
export const LOAD_SOCIAL_LINK = 'LOAD_SOCIAL_LINK';
export const SET_BLOG_TITLE = 'SET_BLOG_TITLE';

const setBlogTitle = ({commit}: Store<any>, title: string) => commit(createAction(SET_BLOG_TITLE, title));

const loadNavList = ({commit}: Store<any>) => {
	return new PostService().getLatestPost()
		.then((result = {}) => {
			commit(createAction(LOAD_NAV_LIST, result.data.posts[0]));
		});
};

const loadSocialLink = ({commit}: Store<any>) => commit(createAction(LOAD_SOCIAL_LINK, SocialLinkSetting));

export default {loadNavList, loadSocialLink, setBlogTitle};
