/**
 * Created by jack on 16-4-27.
 */

import Vue from 'vue';
import template from './post-header.html';

import _defaultImg from '../../../assets/img/contact-bg.jpg';

const postHeader = Vue.component('postHeader', {
	template,
	props: {
		boardImg: {
			type: String,
			default: _defaultImg
		},
		title: {
			type: String
		},
		subTitle: {
			type: String
		},
		createdTime: {
			type: String
		}
	}
});

export default postHeader;
