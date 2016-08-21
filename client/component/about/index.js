/**
 * Created by jack on 16-8-21.
 */

import vue from 'vue';

import template from './template.html';

export default vue.component('aboutMe', {
	template,
	props: ['content']
});
