/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import content from './browsersync.md';

const post = new Post({
	name: 'browsersync',
	title: 'Browsersync',
	createdTime: '2015-11-30',
	content
});

export default post;
