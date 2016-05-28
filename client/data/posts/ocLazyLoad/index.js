/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import content from './ocLazyLoad.md';

const post = new Post({
	name: 'ocLazyLoad',
	title: 'ocLazyLoad',
	subTitle: 'Angular.js 模块按需懒加载',
	createdTime: '2016-05-28',
	content
});

export default post;
