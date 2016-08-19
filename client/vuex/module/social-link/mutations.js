/**
 * Created by jack on 16-8-16.
 */

import svgPath from './social-link.svg';
import {LOAD_SOCIAL_LINK} from './mutation_types';

export default {
	[LOAD_SOCIAL_LINK](state = {}, mutation = {}) {
		state.socialLinkList = mutation.payload
			.filter(item => !!item.link)
			.map(item => ({
				...item,
				svgPath: svgPath + '#' + item.name
			}));
	}
};
