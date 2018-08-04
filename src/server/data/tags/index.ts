/**
 * Created by jack on 16-8-22.
 */

import { ITagBase } from '../../../types/tag';
import { sortFn } from '../../common/DataService';

const TAGS_LIST: ITagBase[] = [{
	name: 'angular-1.x',
	label: 'Angular 1.x',
	createdTime: '2015-12-22',
}, {
	name: 'styleguide',
	label: 'Style Guide',
	createdTime: '2016-06-22',
}, {
	name: 'es6',
	label: 'ECMAScript 2015',
	createdTime: '2015-10-30',
}, {
	name: 'javascript',
	label: 'JavaScript',
	createdTime: '2015-10-30',
}, {
	name: 'css',
	label: 'CSS',
	createdTime: '2016-01-29',
}, {
	name: 'postcss',
	label: 'Postcss',
	createdTime: '2016-02-25',
}, {
	name: 'autoprefixer',
	label: 'Autoprefixer',
	createdTime: '2016-02-25',
}, {
	name: 'tool',
	label: 'Tool',
	createdTime: '2015-11-30',
}, {
	name: 'browsersync',
	label: 'Browsersync',
	createdTime: '2015-11-30',
}, {
	name: 'design-pattern',
	label: 'Design Pattern',
	createdTime: '2016-04-13',
}, {
	name: 'translate',
	label: 'Translate',
	createdTime: '2016-04-13',
}, {
	name: 'redux',
	label: 'Redux',
	createdTime: '2016-07-06',
}, {
	name: 'state-management',
	label: 'State Management',
	createdTime: '2016-07-06',
}, {
	name: 'graphql',
	label: 'GraphQL',
	createdTime: '2016-08-01',
}, {
	name: 'graphql-js',
	label: 'GraphQL JS',
	createdTime: '2016-08-03',
}, {
	name: 'document',
	label: 'Document',
	createdTime: '2016-03-26',
}, {
	name: 'npm',
	label: 'npm',
	createdTime: '2016-04-27',
}, {
	name: 'cnpm',
	label: 'cnpm',
	createdTime: '2016-04-27',
}, {
	name: 'sinopia',
	label: 'Sinopia',
	createdTime: '2016-04-27',
}, {
	name: 'ui-router',
	label: 'ui-router',
	createdTime: '2016-05-28',
}, {
	name: 'redux-ui-router',
	label: 'redux-ui-router',
	createdTime: '2016-07-23',
}, {
	name: 'ng-redux',
	label: 'ng-redux',
	createdTime: '2016-07-23',
}, {
	name: 'vue1',
	label: 'Vue 1.0',
	createdTime: '2016-08-14',
}, {
	name: 'vue2',
	label: 'Vue 2.0',
	createdTime: '2016-08-14',
}, {
	name: 'vue-router',
	label: 'vue-router',
	createdTime: '2016-08-14',
}, {
	name: 'vuex',
	label: 'vuex',
	createdTime: '2016-08-21',
}, {
	name: 'debug',
	label: 'Debug',
	createdTime: '2016-09-03',
}, {
	name: 'wechat',
	label: 'wechat',
	createdTime: '2016-09-03',
}, {
	name: 'material-design',
	label: 'Material Design',
	createdTime: '2016-09-11',
}, {
	name: 'react',
	label: 'React',
	createdTime: '2016-09-23',
}, {
	name: 'ci',
	label: 'CI',
	createdTime: '2016-10-19',
}, {
	name: 'travis',
	label: 'Travis-ci',
	createdTime: '2016-10-19',
}, {
	name: 'codecov',
	label: 'Code',
	createdTime: '2016-10-19',
}, {
	name: 'nightwatch',
	label: 'Nightwatch',
	createdTime: '2016-10-19',
}, {
	name: 'saucelabs',
	label: 'Sauce Labs',
	createdTime: '2016-10-19',
}, {
	name: 'ssr',
	label: 'Server Side Render',
	createdTime: '2016-11-30',
}, {
	name: 'seo',
	label: 'SEO',
	createdTime: '2016-11-30',
}, {
	name: 'koa2',
	label: 'KOA 2',
	createdTime: '2016-11-30',
}, {
	name: 'structure-data',
	label: 'Structure data',
	createdTime: '2016-12-21',
}, {
	name: 'rdfa-lite',
	label: 'RDFa Lite',
	createdTime: '2016-12-21',
}, {
	name: 'docker',
	label: 'Docker',
	createdTime: '2017-01-30',
}, {
	name: 'docker-compose',
	label: 'Docker Compose',
	createdTime: '2017-01-30',
}, {
	name: 'nginx',
	label: 'Nginx',
	createdTime: '2017-01-30',
}, {
	name: 'https',
	label: 'Https',
	createdTime: '2017-01-30',
}, {
	name: 'certbot',
	label: 'Certbot / Let’s Encrypt',
	createdTime: '2017-01-30',
}, {
	name: 'ui',
	label: 'UI',
	createdTime: '2017-02-16',
}, {
	name: 'design',
	label: 'Design',
	createdTime: '2017-02-16',
}, {
	name: 'pwa',
	label: 'Progressive web apps',
	createdTime: '2017-02-25',
}, {
	name: 'service-workers',
	label: 'Service Workers',
	createdTime: '2017-02-25',
}, {
	name: 'notification',
	label: 'Notification',
	createdTime: '2017-03-21',
}, {
	name: 'installable',
	label: 'Add to home screen',
	createdTime: '2017-04-01',
}, {
	name: 'webshare',
	label: 'Web Share',
	createdTime: '2017-04-01',
}, {
	name: 'minimax',
	label: 'Minimax',
	createdTime: '2017-04-04',
}, {
	name: 'alpha-beta',
	label: 'Alpha beta pruning',
	createdTime: '2017-04-04',
}, {
	name: 'webpack',
	label: 'Webpack',
	createdTime: '2017-04-09',
}, {
	name: 'fp',
	label: 'Functional Programming',
	createdTime: '2017-06-21',
}, {
	name: 'typescript',
	label: 'TypeScript',
	createdTime: '2017-08-11',
}, {
	name: 'tslint',
	label: 'Tslint',
	createdTime: '2017-08-11',
}, {
	name: 'wechat',
	label: 'Wechat',
	createdTime: '2018-01-31',
}, {
	name: 'miniprogram',
	label: 'Miniprogram',
	createdTime: '2018-01-31',
}, {
	name: 'minigame',
	label: 'Minigame',
	createdTime: '2018-02-25',
}, {
	name: 'babel',
	label: 'Babel',
	createdTime: '2018-08-04',
}];

export default TAGS_LIST.sort(sortFn('createdTime'));
