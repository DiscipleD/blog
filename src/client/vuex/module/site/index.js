/**
 * Created by jack on 16-8-15.
 */

import { BLOG_TITLE } from 'common/constant/site';
import mutations from './mutations';
import actions from './actions';

export default {
	state: {
		title: BLOG_TITLE,
		navList: [],
		socialLinkList: []
	},
	getters: {
		title: state => state.title,
		navList: state => state.navList,
		socialLinkList: state => state.socialLinkList
	},
	actions,
	mutations
};
