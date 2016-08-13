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
	mounted: () => {
		new DisqusService().resetDisqusCountPlugin();
	}
});

export default PostComponent;
