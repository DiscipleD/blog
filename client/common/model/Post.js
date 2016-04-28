/**
 * Created by jack on 16-4-27.
 * Post Object Module
 */

export default class Post {
	constructor({headerImg, subTitle = '', createdTime = '', name, title, content} = {}) {
		this.name = name;
		this.title = title;
		this.subTitle = subTitle;
		this.createdTime = createdTime;
		this.content = content;
		this.headerImg = headerImg;
	}
}
