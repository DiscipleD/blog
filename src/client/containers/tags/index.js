/**
 * Created by jack on 16-8-27.
 */

import vue from 'vue';
import { mapState, mapActions } from 'vuex';

import template from './tags.html';

const Tags = vue.extend({
	template,
	computed: mapState({
		header: state => state.tags.header,
		tagsList: state => state.tags.list,
		isLoading: state => state.tags.isLoading,
		tagName: state => state.route.params.tagName
	}),
	methods: mapActions(['initTagsPage', 'queryTagsList']),
	watch: {
		'tagName': function() {
			this.queryTagsList({ tagName: this.tagName, router: this.$router });
		}
	},
	created() {
		this.initTagsPage();
		this.queryTagsList({ tagName: this.tagName, router: this.$router });
	}
});

export default Tags;
