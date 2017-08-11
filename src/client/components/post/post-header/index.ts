/**
 * Created by jack on 16-4-27.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import './style.scss';
import template from './post-header.html';
import _defaultImg from '../../../assets/img/tags-bg.jpg';

@Component({
	props: {
		boardImg: {
			type: String,
			default: _defaultImg,
		},
		title: {
			type: String,
		},
		subtitle: {
			type: String,
		},
		tags: {
			type: Array,
		},
		createdDate: {
			type: String,
		},
	},
	template,
})
class PostHeader extends Vue {}

export default Vue.component('postHeader', PostHeader);
