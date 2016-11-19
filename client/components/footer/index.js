/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';

import './style.scss';
import template from './template.html';

export default Vue.component('pageFooter', {
	template,
	props: ['socialLinkList']
});
