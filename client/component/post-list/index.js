/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import template from './post-list.html';
import './style.scss';
import DisqusService from '../../common/service/DisqusService';

const PostComponent = Vue.component('postList', {
	template,
	props: ['postList'],
	ready: () => {
		// manually handle data pass delay because of page props render
		// Try to remove it on Vue 2.0
		setTimeout(() => {
			new DisqusService().resetDisqusCountPlugin();
		}, 50);
	}
});

export default PostComponent;
