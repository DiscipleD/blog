/**
 * Created by jack on 16-8-14.
 */

import Post from '../../../common/model/Post';

import content from './troubleshooting-of-upgrading-vue.md';

const post = new Post({
	name: 'troubleshooting-of-upgrading-vue',
	title: 'Vue 2.0 升（cai）级（keng）之旅',
	subTitle: 'Troubleshooting of upgrading Vue from 1.0 to 2.0',
	createdTime: '2016-08-14',
	tags: ['JavaScript', 'vue 1.0+', 'vue 2.0', 'vue-router'],
	content
});

export default post;
