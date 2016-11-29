/**
 * Created by jack on 16-11-27.
 */

import { app, store } from './client/app';

store.replaceState(window.__INITIAL_STATE__);

app.$mount('#app');
