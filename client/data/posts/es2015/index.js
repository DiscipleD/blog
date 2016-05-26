/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import content from './ECMAScript6.md';

const post = new Post({
	name: 'es2015',
	title: 'ES 6',
	subTitle: 'ECMAScript 6 学习总结',
	createdTime: '2015-10-30',
	content
});

export default post;
