/**
 * Created by d.d on 18/07/2017.
 */

import { ITagShort } from './tag';

export default class Post {
	public name: string;
	public title: string;
	public content: string;
	public subtitle: string;
	public createdTime: string;
	public headerImgName: string;
	constructor({ name = '', title = '', content = '', subtitle = '', createdTime = '', headerImageType = '.jpg' } = {}) {
		this.name = name;
		this.title = title;
		this.subtitle = subtitle;
		this.createdTime = createdTime;
		this.content = content;
		this.headerImgName = createdTime + headerImageType;
	}
}

export interface IPostShort {
	name: string;
	title: string;
}

export interface IPostPage extends Post {
	prevPost?: IPostShort;
	nextPost?: IPostShort;
	tags?: ITagShort[];
}
