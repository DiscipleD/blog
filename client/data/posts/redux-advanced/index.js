/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import content from './redux-advanced.md';

const post = new Post({
	name: 'redux-advanced',
	title: 'Redux 进阶',
	subTitle: 'Advanced skill in Redux',
	createdTime: '2016-07-23',
	tags: ['JavaScript', 'Redux', 'State management', 'Angular 1.x', 'ui-router', 'redux-ui-router'],
	content
});

export default post;
