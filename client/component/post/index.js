/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';

import './post-header';
import template from './post.html';
import './post.scss';
import DisqusService from '../../common/service/DisqusService';

const PostComponent = Vue.component('post', {
	template,
	props: ['post'],
	ready: function() {
		DisqusService.loadDisqusPlugin();
		// manually handle data pass delay because of page props render
		// Try to remove it on Vue 2.0
		setTimeout(() => {
			const disqueService = new DisqusService();
			disqueService.resetDisqusPlugin(this.post.name, this.post.title);
		}, 50);
	}
});

export default PostComponent;
