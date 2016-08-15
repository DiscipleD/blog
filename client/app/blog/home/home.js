/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';

import PostService from '../../../common/service/PostService';

import img from '../../../assets/img/home-bg.jpg';
import template from './home.html';

const Home = Vue.extend({
	template,
	data: () => {
		return {
			header: {
				img,
				title: 'D.D Blog',
				subtitle: 'Share More, Gain More.'
			},
			postList: []
		};
	},
	created() {
		const postService = new PostService();
		postService.queryPostList().then(({postList}) => (this.postList = postList));
	}
});

export default Home;
