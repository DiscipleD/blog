/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import headerImg from './header-img-2015-12-22.jpg';
import content from './angular-provide.md';

const post = new Post({
	headerImg,
	name: 'angular-provide',
	title: 'Angular $provide',
	createdTime: '2015-12-22',
	content
});

export default post;
