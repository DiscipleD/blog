/**
 * Created by jack on 16-9-4.
 */

import Vue from 'vue';

import template from './template.html';
import './style.scss';

const PagerComponent = Vue.component('pager', {
	template,
	props: ['prev', 'next']
});

export default PagerComponent;
