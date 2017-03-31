/**
 * Created by jack on 16-8-17.
 */

// There're something wrong with the file name 'NavItem'

const noon = () => {};
export default class NavItem {
	constructor(name = '', title = '', path = '/', event = noon) {
		this.name = name;
		this.title = title;
		this.path = path;
		this.event = event;
	}
}
