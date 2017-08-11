import { IPostShort } from './post';

export interface ITagShort {
	name: string;
	label: string;
}

export interface ITagBase {
	name: string;
	createdTime: string;
	label: string;
}

export default class Tag implements ITagBase {
	public id: number;
	public name: string;
	public createdTime: string;
	public label: string;
	constructor({ id = -1, name = '', label = '', createdTime = '' } = {}) {
		this.id = id;
		this.name = name;
		this.label = label;
		this.createdTime = createdTime;
	}
}

export interface ITagPage extends Tag {
	posts: IPostShort[];
}
