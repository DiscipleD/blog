/**
 * Created by jack on 16-8-27.
 */

import Vue, { ComponentOptions } from 'vue';
import { mapState, mapActions, Store } from 'vuex';
import VueRouterstore from 'vue-router';

import template from './tags.html';
import { getActionContext } from 'vuexModule/../common/actionHelper';
import { RootState } from 'vuexModule/index';
import { TagsState } from 'vuexModule/tags';
import tagsActions, { TagQueryParam } from 'vuexModule/tags/actions';

export interface TagsContainer extends Vue {
	tagName: string,
	initTagsPage: () => void,
	queryTagsList: (params: TagQueryParam) => void
}

export default Vue.extend({
	template,
	computed: mapState({
		header: (state: RootState) => state.tags.header,
		tagsList: (state: RootState) => state.tags.list,
		isLoading: (state: RootState) => state.tags.isLoading,
		tagName: (state: RootState) => state.route.params.tagName
	}),
	methods: mapActions(['initTagsPage', 'queryTagsList']),
	watch: {
		'tagName': function() {
			this.queryTagsList({
				tagName: this.tagName,
				router: this.$router
			});
		}
	},
	created() {
		this.initTagsPage();
		this.queryTagsList({
			tagName: this.tagName,
			router: this.$router
		});
	},
	preFetch(store: Store<RootState>, router: VueRouterstore) {
		const actionContext = getActionContext<TagsState, RootState>('tags', store);
		return tagsActions.queryTagsList(actionContext, {
			tagName: store.state.route.params.tagName,
			enableLoading: false,
			router
		});
	}
} as ComponentOptions<TagsContainer>);
