/**
 * Created by jack on 16-4-21.
 */

import Vue, { ComponentOptions } from 'vue';
import Component from 'vue-class-component';
import { mapState, mapGetters, mapActions, Store } from 'vuex';

import { getActionContext } from '@/vuex/common/actionHelper';
import template from './home.html';
import { IRootState } from '@/vuex/module/index';
import { HomeState } from '@/vuex/module/home';
import homeActions from '@/vuex/module/home/actions';

@Component({
	computed: {
		...mapState({
			header: (state: IRootState) => state.home.header,
		}),
		...mapGetters(['posts']),
	},
	methods: mapActions(['initHomePage', 'loadPostList']),
	template,
	preFetch(store: Store<IRootState>) {
		const actionContext = getActionContext<HomeState, IRootState>('home', store);
		return homeActions.loadPostList(actionContext);
	},
})
export default class HomeContainer extends Vue {
	public initHomePage: () => void;

	public mounted() {
		this.initHomePage();
	}
}
