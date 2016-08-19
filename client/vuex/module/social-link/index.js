/**
 * Created by jack on 16-8-15.
 */

import mutations from './mutations';
import {loadSocialLink} from './actions';

export default {
	state: {
		// socialLinkList: []
	},
	actions: {
		loadSocialLink
	},
	getters: {
		socialLinkList: state => state.socialLinkList
	},
	mutations
};
