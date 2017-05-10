/**
 * Created by jack on 16-8-23.
 */

import {sortFn} from '../../common/DataService';

const POSTS_LIST = [{
	name: 'angular1.5-with-ES6-styleguide',
	title: 'Angular 1.5 Styleguide (ES2015)',
	subtitle: '使用 ES2015 在 Angular 1.5 中的最佳实践',
	createdDate: '2016-06-22',
	tags: ['javascript', 'es6', 'angular-1.x', 'styleguide']
}, {
	name: 'angular-provide',
	title: 'Angular $provide',
	createdDate: '2015-12-22',
	tags: ['javascript', 'angular-1.x']
}, {
	name: 'autoprefixer',
	title: 'AutoPrefixer',
	subtitle: '一个处理CSS前缀问题的神器',
	createdDate: '2016-02-25',
	tags: ['css', 'postcss', 'autoprefixer', 'tool']
}, {
	name: 'browsersync',
	title: 'Browsersync',
	createdDate: '2015-11-30',
	tags: ['browsersync', 'tool']
}, {
	name: 'css-flex',
	title: 'Css Flex',
	createdDate: '2016-01-29',
	tags: ['css']
}, {
	name: 'decorator-design-pattern',
	title: 'JS 5种不同的方法实现装饰者模式（译）',
	subtitle: '为了自身乐趣和加强理解使用闭包、猴子补丁、原型、代理和中间件5种不同方式在 javascript 中实现装饰者模式。',
	createdDate: '2016-04-13',
	tags: ['javascript', 'design-pattern', 'translate']
}, {
	name: 'does-curry-help',
	title: '柯里化还好用么？（译）',
	createdDate: '2016-05-18',
	tags: ['javascript', 'translate']
}, {
	name: 'es2015',
	title: 'ES 6',
	subtitle: 'ECMAScript 6 学习总结',
	createdDate: '2015-10-30',
	tags: ['javascript', 'es6']
}, {
	name: 'getting-started-with-redux',
	title: 'Redux 入门',
	subtitle: 'A tiny predictable state management lib for JavaScript apps',
	createdDate: '2016-07-06',
	tags: ['javascript', 'es6', 'redux', 'state-management', 'angular-1.x']
}, {
	name: 'graphql-core-concepts',
	title: 'GraphQL 核心概念',
	subtitle: 'A query language created by Facebook for describing data requirements on complex application data models',
	createdDate: '2016-08-01',
	tags: ['graphql']
}, {
	name: 'graphql-js-entry',
	title: 'graphql-js 浅尝',
	subtitle: 'A JavaScript implementation for GraphQL',
	createdDate: '2016-08-03',
	tags: ['graphql', 'javascript', 'graphql-js']
}, {
	name: 'js-doc',
	title: 'JSDoc',
	subtitle: '前端代码文档化势在必行',
	createdDate: '2016-03-26',
	tags: ['document', 'tool']
}, {
	name: 'ocLazyLoad',
	title: 'ocLazyLoad',
	subtitle: 'Angular.js 模块按需懒加载',
	createdDate: '2016-05-28',
	tags: ['javascript', 'angular-1.x', 'ui-router']
}, {
	name: 'private-npm-server',
	title: '企业私有 npm 服务器',
	subtitle: 'cnpm OR sinopia',
	createdDate: '2016-04-27',
	tags: ['npm', 'cnpm', 'sinopia', 'tool']
}, {
	name: 'redux-advanced',
	title: 'Redux 进阶',
	subtitle: 'Advanced skill in Redux',
	createdDate: '2016-07-23',
	tags: ['javascript', 'redux', 'state-management', 'angular-1.x', 'ng-redux', 'ui-router', 'redux-ui-router']
}, {
	name: 'troubleshooting-of-upgrading-vue',
	title: 'Vue 2.0 升（cai）级（keng）之旅',
	subtitle: 'Troubleshooting of upgrading Vue from 1.0 to 2.0',
	createdDate: '2016-08-14',
	tags: ['javascript', 'vue1', 'vue2', 'vue-router']
}, {
	name: 'vuex-core-of-vue-application',
	title: 'Vuex — The core of Vue application',
	subtitle: '随着 Vue 2.0 的发布，Vuex 也伴随着推出了最新版，本文就带你对照 Redux 来看看刚刚出炉的 Vuex 2.0',
	createdDate: '2016-08-21',
	tags: ['javascript', 'vue2', 'vue-router', 'vuex', 'redux', 'state-management']
}, {
	name: 'why-curry-helps',
	title: '为什么使用柯里化？（译）',
	createdDate: '2016-05-05',
	tags: ['javascript', 'es6', 'translate']
}, {
	name: 'remote-debugging-devices',
	title: 'Remote Debugging Devices',
	createdDate: '2016-09-03',
	tags: ['tool', 'browsersync', 'debug', 'wechat']
}, {
	name: 'material-loading',
	title: 'Loading of Material Design',
	subtitle: 'Imitate Material Design implement loading component with SVG',
	createdDate: '2016-09-11',
	tags: ['css', 'material-design']
}, {
	name: 'you-might-not-need-redux',
	title: '【译】也许你不必使用 Redux',
	createdDate: '2016-09-23',
	tags: ['redux', 'react', 'translate']
}, {
	name: 'ci-solution',
	title: '前端持续集成解决方案',
	createdDate: '2016-10-19',
	tags: ['ci', 'travis', 'codecov', 'nightwatch', 'saucelabs']
}, {
	name: 'ssr',
	title: 'From SPA to SSR',
	subtitle: '从单页应用到服务器渲染',
	createdDate: '2016-11-30',
	tags: ['ssr', 'seo', 'vue2', 'koa2']
}, {
	name: 'structure-data',
	title: '结构化数据让 SEO 更上一层楼',
	createdDate: '2016-12-21',
	tags: ['seo', 'structure-data', 'rdfa-lite']
}, {
	name: 'docker-compose',
	title: 'Transformer: Docker Compose',
	subtitle: '整合发布应用相关全部服务',
	createdDate: '2017-01-30',
	tags: ['docker', 'docker-compose', 'nginx', 'https', 'certbot']
}, {
	name: 'how-to-use-colors-in-ui',
	title: '[译] UI 设计中颜色正确的打开方式',
	createdDate: '2017-02-16',
	tags: ['translate', 'ui', 'design']
}, {
	name: 'service-workers',
	title: 'Service Workers 和离线缓存',
	createdDate: '2017-02-25',
	tags: ['pwa', 'service-workers']
}, {
	name: 'notification-with-sw-push-events',
	title: 'Notification with Service Workers push events',
	createdDate: '2017-03-21',
	tags: ['pwa', 'service-workers', 'notification']
}, {
	name: 'pwa-installable-and-share',
	title: 'PWA：添加应用至桌面及分享',
	createdDate: '2017-04-01',
	tags: ['pwa', 'installable', 'webshare']
}, {
	name: 'simple-chess-ai-step-by-step',
	title: '[译]手把手教你创建国际象棋 AI',
	createdDate: '2017-04-04',
	tags: ['translate', 'minimax', 'alpha-beta'],
	imageType: '.jpeg'
}, {
	name: 'upgrade-to-webpack2',
	title: '升级 webpack 至 v2.2.x',
	createdDate: '2017-04-09',
	tags: ['webpack']
}, {
	name: 'upgrade-ssr-of-vue',
	title: 'Vue v2.3.0 ssr 升级手册',
	createdDate: '2017-05-10',
	tags: ['vue2', 'ssr', 'webpack']
}];

export default POSTS_LIST.sort(sortFn('createdDate'));
