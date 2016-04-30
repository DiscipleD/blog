/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import headerImg from './header-img-2016-01-29.jpg';
import content from './css-flex.md';

const post = new Post({
	headerImg,
	name: 'css-flex',
	title: 'Css Flex',
	createdTime: '2016-01-29',
	content
});

export default post;
