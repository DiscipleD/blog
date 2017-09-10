/**
 * Created by jack on 16-4-21.
 */

import Vue, { ComponentOptions } from 'vue';
import Component from 'vue-class-component';
import { mapState, mapGetters, mapActions, Store } from 'vuex';

import { getActionContext } from 'vuexModule/../common/actionHelper';
import template from './home.html';
import { IRootState } from 'vuexModule/index';
import { HomeState } from 'vuexModule/home';
import homeActions from 'vuexModule/home/actions';

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
