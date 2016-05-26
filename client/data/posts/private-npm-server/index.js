/**
 * Created by jack on 16-4-27.
 */

import Post from '../../../common/model/Post';

import content from './private-npm-server.md';

const post = new Post({
	name: 'private-npm-server',
	title: '企业私有 npm 服务器',
	subTitle: 'cnpm OR sinopia',
	createdTime: '2016-04-27',
	content
});

export default post;
