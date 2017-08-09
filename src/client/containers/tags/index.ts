/**
 * Created by jack on 16-8-27.
 */

import Vue, { ComponentOptions } from 'vue';
import { mapState, mapActions, Store } from 'vuex';
import VueRouterstore from 'vue-router';

import template from './tags.html';
import { getActionContext } from 'vuexModule/../common/actionHelper';
import { IRootState } from 'vuexModule/index';
import { TagsState } from 'vuexModule/tags';
import tagsActions, { ITagQueryParam } from 'vuexModule/tags/actions';

export interface ITagsContainer extends Vue {
	tagName: string;
	initTagsPage: () => void;
	queryTagsList: (params: ITagQueryParam) => void;
}

export default Vue.extend({
	template,
	computed: mapState({
		header: (state: IRootState) => state.tags.header,
		tagsList: (state: IRootState) => state.tags.list,
		isLoading: (state: IRootState) => state.tags.isLoading,
		tagName: (state: IRootState) => state.route.params.tagName,
	}),
	methods: mapActions(['initTagsPage', 'queryTagsList']),
	watch: {
		tagName() {
			this.queryTagsList({
				tagName: this.tagName,
				router: this.$router,
			});
		},
	},
	created() {
		this.initTagsPage();
		this.queryTagsList({
			tagName: this.tagName,
			router: this.$router,
		});
	},
	preFetch(store: Store<IRootState>, router: VueRouterstore) {
		const actionContext = getActionContext<TagsState, IRootState>('tags', store);
		return tagsActions.queryTagsList(actionContext, {
			tagName: store.state.route.params.tagName,
			enableLoading: false,
			router,
		});
	},
} as ComponentOptions<ITagsContainer>);
