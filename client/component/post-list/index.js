/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import template from './post-list.html';
import './style.scss';

const PostComponent = Vue.component('postList', {
	template,
	props: ['postList']
});

export default PostComponent;
