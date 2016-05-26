/**
 * Created by jack on 16-5-5.
 */

import Post from '../../../common/model/Post';

import content from './why-curry-helps.md';

const post = new Post({
	name: 'why-curry-helps',
	title: '为什么使用柯里化？（译）',
	createdTime: '2016-05-05',
	content
});

export default post;
