/**
 * Created by jack on 16-4-21.
 */

import Vue, { ComponentOptions } from 'vue';
import { mapState, mapGetters, mapActions, Store } from 'vuex';

import { getActionContext } from 'vuexModule/../common/actionHelper';
import template from './home.html';
import { RootState } from 'vuexModule/index';
import { HomeState } from 'vuexModule/home';
import homeActions from 'vuexModule/home/actions';

export interface HomeContainer extends Vue {
	initHomePage: () => void
}

export default Vue.extend({
	template,
	computed: {
		...mapState({
			header: (state: RootState) => state.home.header
		}),
		...mapGetters(['posts'])
	},
	methods: mapActions(['initHomePage', 'loadPostList']),
	created() {
		this.initHomePage();
	},
	preFetch(store: Store<RootState>) {
		const actionContext = getActionContext<HomeState, RootState>('home', store);
		return homeActions.loadPostList(actionContext);
	}
} as ComponentOptions<HomeContainer>);
