/**
 * Created by jack on 16-5-15.
 */

export interface SocialLink {
	name: string,
	link: string
}

const SocialLinkSetting: Array<SocialLink> = [{
	name: 'douban',
	link: 'https://book.douban.com/mine?icn=index-nav'
}, {
	name: 'facebook',
	link: ''
}, {
	name: 'github',
	link: 'https://github.com/DiscipleD'
}, {
	name: 'gmail',
	link: ''
}, {
	name: 'jianshu',
	link: 'http://www.jianshu.com/users/6ed7563919d4/latest_articles'
}, {
	name: 'linkedin',
	link: ''
}, {
	name: 'medium',
	link: ''
}, {
	name: 'sina',
	link: ''
}, {
	name: 'twitter',
	link: ''
}, {
	name: 'xitujuejin',
	link: ''
}, {
	name: 'youtube',
	link: ''
}, {
	name: 'zhihu',
	link: 'https://www.zhihu.com/people/discipled'
}];

export default SocialLinkSetting;
