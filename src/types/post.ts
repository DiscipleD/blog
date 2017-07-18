/**
 * Created by d.d on 18/07/2017.
 */

export default class Post {
    name: string;
    title: string;
    content: string;
    subtitle: string;
    createdTime: string;
    headerImgName: string;
    constructor({name = '', title = '', content = '', subtitle = '', createdTime = '', headerImageType = '.jpg'} = {}) {
        this.name = name;
        this.title = title;
        this.subtitle = subtitle;
        this.createdTime = createdTime;
        this.content = content;
        this.headerImgName = createdTime + headerImageType;
    }
}
