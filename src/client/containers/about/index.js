/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import aboutActions from 'vuexModule/about-me/actions';
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
	},
	preFetch(store) {
		return aboutActions.initAboutPage(store);
	}
});

export default About;
