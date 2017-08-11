/**
 * Created by jack on 16-8-21.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import './style.scss';
import template from './template.html';

@Component({
	props: ['introduction'],
	template,
})
class AboutMe extends Vue {}

export default Vue.component('aboutMe', AboutMe);
