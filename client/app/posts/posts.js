/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import template from './post.html';

const Posts = Vue.extend({
	template,
	data: () => {
		return { headerImg: '' };
	}
});

export default Posts;
