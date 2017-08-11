/**
 * Created by jack on 16-8-27.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import template from './template.html';
import './style.scss';

@Component({
	props: ['tagsList'],
	template,
})
class Tags extends Vue {}

export default Vue.component('tags', Tags);
