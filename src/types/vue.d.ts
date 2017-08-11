import Vue from 'vue';
import { Store } from 'vuex';
import VueRouter from 'vue-router';

import { IRootState } from 'vuexModule/index';

declare global {
  interface Window {
    __INITIAL_STATE__: any
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    preFetch?: (store: Store<IRootState>, router?: VueRouter) => Promise<any>
  }
}
