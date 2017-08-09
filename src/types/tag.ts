import { IPostShort } from './post';

export interface ITagShort {
	name: string;
	label: string;
}

export default class Tag {
	public id: number;
	public name: string;
	public createdDate: string;
	public label: string;
}

export interface ITagPage extends Tag {
	posts: IPostShort[];
}
