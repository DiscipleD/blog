/**
 * Created by jack on 16-4-27.
 * Post Object Module
 */

export default class Post {
	constructor({name, title, content, subTitle = '', createdTime = '', headerImageType = '.jpg'} = {}) {
		this.name = name;
		this.title = title;
		this.subTitle = subTitle;
		this.createdTime = createdTime;
		this.content = content;
		this.headerImgName = createdTime + headerImageType;
	}
}
