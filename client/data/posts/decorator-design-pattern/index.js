/**
 * Created by jack on 16-4-29.
 */

import Post from '../../../common/model/Post';

import content from './decorator-design-pattern.md';

const post = new Post({
	name: 'decorator-design-pattern',
	title: 'JS 5种不同的方法实现装饰者模式（译）',
	subTitle: '为了自身乐趣和加强理解使用闭包、猴子补丁、原型、代理和中间件5种不同方式在 javascript 中实现装饰者模式。',
	createdTime: '2016-04-13',
	content
});

export default post;
