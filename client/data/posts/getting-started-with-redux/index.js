/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import content from './getting-started-with-redux.md';

const post = new Post({
	name: 'getting-started-with-redux',
	title: 'Redux 入门',
	subTitle: 'A tiny predictable state management lib for JavaScript apps',
	createdTime: '2016-07-06',
	content
});

export default post;
