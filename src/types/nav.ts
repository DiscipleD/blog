/**
 * Created by d.d on 18/07/2017.
 */

const noon = () => { };
export class Item {
	public name: string;
	public title: string;
	public path: string;
	public event?: () => void;

	constructor(name = '', title = '', path = '/', event = noon) {
		this.name = name;
		this.title = title;
		this.path = path;
		this.event = event;
	}
}
