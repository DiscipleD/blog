/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import headerImg from './header-img-2016-02-25.jpg';
import content from './autoprefixer.md';

const post = new Post({
	headerImg,
	name: 'autoprefixer',
	title: 'AutoPrefixer',
	subTitle: '一个处理CSS前缀问题的神器',
	createdTime: '2016-02-25',
	content
});

export default post;
