/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import headerImg from './header-img-2015-11-30.jpg';
import content from './browsersync.md';

const post = new Post({
	headerImg,
	name: 'browsersync',
	title: 'Browsersync',
	createdTime: '2015-11-30',
	content
});

export default post;
