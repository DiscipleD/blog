/**
 * Created by jack on 16-8-21.
 */

import Post from '../../../common/model/Post';

import content from './vuex-core-of-vue-application.md';

const post = new Post({
	name: 'vuex-core-of-vue-application',
	title: 'Vuex — The core of Vue application',
	subTitle: '随着 Vue 2.0 的发布，Vuex 也伴随着推出了最新版，本文就带你对照 Redux 来看看刚刚出炉的 Vuex 2.0',
	createdTime: '2016-08-21',
	tags: ['JavaScript', 'vue 2.0', 'vue-router', 'vuex', 'Redux', 'state management'],
	content
});

export default post;
