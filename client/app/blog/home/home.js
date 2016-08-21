/**
 * Created by jack on 16-4-21.
 */

import vue from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';

import template from './home.html';

const Home = vue.extend({
	template,
	computed: {
		...mapState({
			header: state => state.home.header
		}),
		...mapGetters(['postsList'])
	},
	methods: mapActions(['initHomePage']),
	created() {
		this.initHomePage();
	}
});

export default Home;
