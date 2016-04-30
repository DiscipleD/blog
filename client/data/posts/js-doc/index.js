/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import headerImg from './header-img-2016-03-26.jpg';
import content from './js-doc.md';

const post = new Post({
	headerImg,
	name: 'jsDoc',
	title: 'JSDoc',
	subTitle: '前端代码文档化势在必行',
	createdTime: '2016-03-26',
	content
});

export default post;
