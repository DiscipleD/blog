import Vue from 'vue';
import { Store } from 'vuex';
import VueRouter from 'vue-router';

import { RootState } from 'vuexModule/index';

interface ComponentOptions<V extends Vue> {
  preFetch?: (store: Store<RootState>, router?: VueRouter) => Promise<any>
}
