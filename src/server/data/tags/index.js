/**
 * Created by jack on 16-8-22.
 */

import {sortFn} from '../../common/DataService';

const TAGS_LIST = [{
	name: 'angular-1.x',
	label: 'Angular 1.x',
	createdDate: '2015-12-22'
}, {
	name: 'styleguide',
	label: 'Style Guide',
	createdDate: '2016-06-22'
}, {
	name: 'es6',
	label: 'ECMAScript 2015',
	createdDate: '2015-10-30'
}, {
	name: 'javascript',
	label: 'JavaScript',
	createdDate: '2015-10-30'
}, {
	name: 'css',
	label: 'CSS',
	createdDate: '2016-01-29'
}, {
	name: 'postcss',
	label: 'Postcss',
	createdDate: '2016-02-25'
}, {
	name: 'autoprefixer',
	label: 'Autoprefixer',
	createdDate: '2016-02-25'
}, {
	name: 'tool',
	label: 'Tool',
	createdDate: '2015-11-30'
}, {
	name: 'browsersync',
	label: 'Browsersync',
	createdDate: '2015-11-30'
}, {
	name: 'design-pattern',
	label: 'Design Pattern',
	createdDate: '2016-04-13'
}, {
	name: 'translate',
	label: 'Translate',
	createdDate: '2016-04-13'
}, {
	name: 'redux',
	label: 'Redux',
	createdDate: '2016-07-06'
}, {
	name: 'state-management',
	label: 'State Management',
	createdDate: '2016-07-06'
}, {
	name: 'graphql',
	label: 'GraphQL',
	createdDate: '2016-08-01'
}, {
	name: 'graphql-js',
	label: 'GraphQL JS',
	createdDate: '2016-08-03'
}, {
	name: 'document',
	label: 'Document',
	createdDate: '2016-03-26'
}, {
	name: 'npm',
	label: 'npm',
	createdDate: '2016-04-27'
}, {
	name: 'cnpm',
	label: 'cnpm',
	createdDate: '2016-04-27'
}, {
	name: 'sinopia',
	label: 'Sinopia',
	createdDate: '2016-04-27'
}, {
	name: 'ui-router',
	label: 'ui-router',
	createdDate: '2016-05-28'
}, {
	name: 'redux-ui-router',
	label: 'redux-ui-router',
	createdDate: '2016-07-23'
}, {
	name: 'ng-redux',
	label: 'ng-redux',
	createdDate: '2016-07-23'
}, {
	name: 'vue1',
	label: 'Vue 1.0',
	createdDate: '2016-08-14'
}, {
	name: 'vue2',
	label: 'Vue 2.0',
	createdDate: '2016-08-14'
}, {
	name: 'vue-router',
	label: 'vue-router',
	createdDate: '2016-08-14'
}, {
	name: 'vuex',
	label: 'vuex',
	createdDate: '2016-08-21'
}, {
	name: 'debug',
	label: 'Debug',
	createdDate: '2016-09-03'
}, {
	name: 'wechat',
	label: 'wechat',
	createdDate: '2016-09-03'
}, {
	name: 'material-design',
	label: 'Material Design',
	createdDate: '2016-09-11'
}, {
	name: 'react',
	label: 'React',
	createdDate: '2016-09-23'
}, {
	name: 'ci',
	label: 'CI',
	createdDate: '2016-10-19'
}, {
	name: 'travis',
	label: 'Travis-ci',
	createdDate: '2016-10-19'
}, {
	name: 'codecov',
	label: 'Code',
	createdDate: '2016-10-19'
}, {
	name: 'nightwatch',
	label: 'Nightwatch',
	createdDate: '2016-10-19'
}, {
	name: 'saucelabs',
	label: 'Sauce Labs',
	createdDate: '2016-10-19'
}, {
	name: 'ssr',
	label: 'Server Side Render',
	createdDate: '2016-11-30'
}, {
	name: 'seo',
	label: 'SEO',
	createdDate: '2016-11-30'
}];

export default TAGS_LIST.sort(sortFn('createdDate'));
