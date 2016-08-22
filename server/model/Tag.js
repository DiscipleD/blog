/**
 * Created by jack on 16-8-22.
 */


let TAG_ID = 1;

export default class Tag {
	constructor(name, label, createDate = '') {
		this.id = TAG_ID++;
		this.name = name;
		this.label = label;
		this.createDate = createDate;
	}
}
