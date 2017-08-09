/**
 * Created by jack on 16-4-21.
 */

import Vue, { ComponentOptions } from 'vue';
import { mapState, mapActions, Store } from 'vuex';

import { getActionContext } from 'vuexModule/../common/actionHelper';
import { IRootState } from 'vuexModule/index';
import { AboutMeState } from 'vuexModule/about-me';
import aboutActions from 'vuexModule/about-me/actions';
import template from './about.html';

export interface IAboutContainer extends Vue {
	initAboutPage: () => void;
}

export default Vue.extend({
	template,
	computed: mapState({
		header: (state: IRootState) => state.aboutMe.header,
		introduction: (state: IRootState) => state.aboutMe.introduction,
	}),
	methods: mapActions(['initAboutPage']),
	created() {
		this.initAboutPage();
	},
	preFetch(store: Store<IRootState>) {
		const actionContext = getActionContext<AboutMeState, IRootState>('aboutMe', store);
		return aboutActions.initAboutPage(actionContext);
	},
} as ComponentOptions<IAboutContainer>);
