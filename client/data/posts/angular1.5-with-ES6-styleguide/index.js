/**
 * Created by jack on 16-4-27.
 */

import Post from '../../../common/model/Post';

import content from './angular1.5-styleguide.md';

const post = new Post({
	name: 'angular1.5-with-ES6-styleguide',
	title: 'Angular 1.5 Styleguide (ES2015)',
	subTitle: '使用 ES2015 在 Angular 1.5 中的最佳实践',
	createdTime: '2016-06-22',
	content
});

export default post;
