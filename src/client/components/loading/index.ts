/**
 * Created by jack on 16-9-7.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import template from './template.html';
import './style.scss';

@Component({
	template,
})
class Loading extends Vue {}

export default Vue.component('loading', Loading);
