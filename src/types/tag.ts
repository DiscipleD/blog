import { IPostShort } from './post';

export interface ITagShort {
	name: string;
	label: string;
}

export interface ITagBase {
	name: string;
	createdDate: string;
	label: string;
}

export default class Tag implements ITagBase {
	public id: number;
	public name: string;
	public createdDate: string;
	public label: string;
	constructor({ id = -1, name = '', label = '', createdDate = '' } = {}) {
		this.id = id;
		this.name = name;
		this.label = label;
		this.createdDate = createdDate;
	}
}

export interface ITagPage extends Tag {
	posts: IPostShort[];
}
