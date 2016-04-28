/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import './post-header';

import template from './post.html';
import './post.scss';

const PostComponent = Vue.component('post', {
	template,
	props: ['post']
});

export default PostComponent;
