/**
 * Created by jack on 16-4-27.
 * Post Object Module
 */

let POST_ID = 1;

export default class Post {
	constructor({name, title, content, subTitle = '', createdDate = '', imageType = '.jpg', tags = []} = {}) {
		this.id = POST_ID++;
		this.name = name;
		this.title = title;
		this.subTitle = subTitle;
		this.content = content;
		this.createdDate = createdDate;
		this.headerImgName = createdDate + imageType;
		this.tags = tags;
	}
}
