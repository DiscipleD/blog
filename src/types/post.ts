/**
 * Created by d.d on 18/07/2017.
 */

export interface IPostBase {
	name: string;
	title: string;
	subtitle?: string;
	createdTime: string;
	headerImageType?: string;
	tags: string[];
}

export interface IPost extends IPostBase {
	id: number;
	content: string;
}

export default class Post {
	public id: number;
	public name: string;
	public title: string;
	public content: string;
	public subtitle?: string;
	public createdTime: string;
	public headerImgName: string;
	public tags: string[];
	constructor({
		id = -1,
		name = '',
		title = '',
		content = '',
		subtitle = '',
		createdTime = '',
		headerImageType = '.jpg',
		tags = [] }: IPost) {
		this.id = id;
		this.name = name;
		this.title = title;
		this.subtitle = subtitle;
		this.createdTime = createdTime;
		this.content = content;
		this.headerImgName = createdTime + headerImageType;
		this.tags = tags;
	}
}

export interface IPostShort {
	name: string;
	title: string;
}

export interface IPostPage extends Post {
	prevPost?: IPostShort;
	nextPost?: IPostShort;
}
