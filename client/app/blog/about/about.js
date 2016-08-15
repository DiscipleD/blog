/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import img from '../../../assets/img/about-bg.jpg';
import template from './about.html';

import content from './about.md';

const About = Vue.extend({
	template,
	data: () => {
		return {
			header: {
				img,
				title: 'About D.D',
				subtitle: 'Disciple.Ding'
			},
			content
		};
	}
});

export default About;
