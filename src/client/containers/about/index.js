/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import template from './about.html';

const About = Vue.extend({
	template,
	computed: mapState({
		header: state => state.aboutMe.header,
		introduction: state => state.aboutMe.introduction
	}),
	methods: mapActions(['initAboutPage']),
	created() {
		this.initAboutPage();
	}
});

export default About;
