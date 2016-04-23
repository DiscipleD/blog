/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import headerImg from '../../assets/img/home-bg.jpg';
import template from './home.html';

const Home = Vue.extend({
	template,
	data: () => {
		return { headerImg };
	}
});

export default Home;
