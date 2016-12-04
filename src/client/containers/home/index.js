/**
 * Created by jack on 16-4-21.
 */

import vue from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';

import template from './home.html';
import homeActions from 'vuexModule/home/actions';

const Home = vue.extend({
	template,
	computed: {
		...mapState({
			header: state => state.home.header
		}),
		...mapGetters(['posts'])
	},
	methods: mapActions(['initHomePage', 'loadPostList']),
	created() {
		this.initHomePage().catch(console.log);
	},
	preFetch(store) {
		return homeActions.loadPostList(store).catch(console.log);
	}
});

export default Home;
