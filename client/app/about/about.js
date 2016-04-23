/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import headerImg from '../../assets/img/about-bg.jpg';
import template from './about.html';


const About = Vue.extend({
	template,
	data: () => {
		return { headerImg };
	}
});

export default About;
