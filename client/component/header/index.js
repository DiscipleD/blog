/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import template from './template.html';
import _defaultImg from '../../assets/img/contact-bg.jpg';

export default Vue.component('contentHeader', {
	template,
	props: {
		boardImg: {
			type: String,
			default: _defaultImg
		},
		title: {
			type: String,
			required: true
		},
		subtitle: {
			type: String
		}
	}
});
