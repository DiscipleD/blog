/**
 * Created by jack on 16-4-21.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import './style.scss';
import template from './template.html';

@Component({
	props: ['socialLinkList'],
	template,
})
class PageFooter extends Vue {}

export default Vue.component('pageFooter', PageFooter);
