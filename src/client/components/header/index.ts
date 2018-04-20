/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import './style.scss';
import template from './template.html';
import _defaultImg from '@/assets/img/tags-bg.jpg';

@Component({
	template,
	props: {
		boardImg: {
			type: String,
			default: _defaultImg,
		},
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
		},
	},
})
class Header extends Vue {}

export default Vue.component('contentHeader', Header);
