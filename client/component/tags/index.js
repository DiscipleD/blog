/**
 * Created by jack on 16-8-27.
 */

import Vue from 'vue';

import template from './template.html';
import './style.scss';

const TagsComponent = Vue.component('tags', {
	template,
	props: ['tagsList']
});

export default TagsComponent;
