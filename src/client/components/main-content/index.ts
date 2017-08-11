/**
 * Created by jack on 16-8-21.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import template from './template.html';

@Component({
	template,
})
class MainContent extends Vue {}

export default Vue.component('mainContent', MainContent);
