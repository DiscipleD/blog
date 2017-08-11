/**
 * Created by jack on 16-4-25.
 */

import Vue from 'vue';
import Component from 'vue-class-component';

import template from './template.html';
import './style.scss';
import DisqusService from '../../common/service/disqus/DisqusService';

@Component({
	props: ['postList'],
	template,
})
class PostList extends Vue {
	protected mounted() {
		new DisqusService().resetDisqusCountPlugin();
	}
}

export default Vue.component('postList', PostList);
