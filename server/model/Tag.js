/**
 * Created by jack on 16-8-22.
 */

let TAG_ID = 0;

export default class Tag {
	constructor({name, label, createdDate = ''} = {}) {
		this.id = TAG_ID++;
		this.name = name;
		this.label = label;
		this.createdDate = createdDate;
	}
}
