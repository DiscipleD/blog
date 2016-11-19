/**
 * Created by jack on 16-4-27.
 */

import Vue from 'vue';

import './style.scss';
import template from './post-header.html';
import _defaultImg from '../../../assets/img/tags-bg.jpg';

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
		subtitle: {
			type: String
		},
		tags: {
			type: Array
		},
		createdDate: {
			type: String
		}
	}
});

export default postHeader;
