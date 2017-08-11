/**
 * Created by jack on 16-9-4.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import template from './template.html';
import './style.scss';

@Component({
	props: ['prev', 'next'],
	template,
})
class Pager extends Vue {}

export default Vue.component('pager', Pager);
