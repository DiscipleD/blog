/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';

import svgPath from './social-link.svg';
import './style.scss';
import template from './footer.html';
import { SocialLinkSetting } from './setting';

export default Vue.component('pageFooter', {
	template,
	data: () => {
		return {
			socialLinkList: SocialLinkSetting.filter(item => !!item.link).map(item => {
				item.svgPath = svgPath + '#' + item.name;
				return item;
			})
		};
	}
});
