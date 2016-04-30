/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import headerImg from './header-img-2015-10-30.jpg';
import content from './ECMAScript6.md';

const post = new Post({
	headerImg,
	name: 'es6',
	title: 'ES 6',
	subTitle: 'ECMAScript 6 学习总结',
	createdTime: '2015-10-30',
	content
});

export default post;
