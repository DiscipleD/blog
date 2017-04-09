/**
 * Created by jack on 16-8-29.
 */

const introduction = [
	{
		name: 'motto',
		label: 'Motto',
		value: 'Keep on moving forward to glimpse the end.'
	}, {
		name: 'email',
		label: 'Email',
		value: 'disciple.ding@gmail.com'
	}, {
		name: 'hobby',
		label: 'Hobby',
		value: 'Ball games, Swimming, Travelling, Reading'
	}, {
		name: 'skill',
		label: 'Technology stack',
		value: [{
			name: 'javascript',
			label: 'JavaScript',
			value: [{
				name: 'es6',
				label: 'EcmaScript2015',
				value: 4,
				link: 'https://babeljs.io/docs/learn-es2015/'
			}, {
				name: 'angular1.x',
				label: 'Angular 1.x',
				value: 3,
				link: 'https://docs.angularjs.org/api'
			}, {
				name: 'jquery',
				label: 'jQuery',
				value: 2,
				link: 'http://api.jquery.com/'
			}, {
				name: 'vue',
				label: 'Vue',
				value: 3,
				link: 'https://vuejs.org/api/'
			}, {
				name: 'react',
				label: 'React',
				value: 3.5,
				link: 'https://facebook.github.io/react/docs/getting-started.html'
			}],
			type: 'list'
		}, {
			name: 'state-management',
			label: 'State management',
			value: [{
				name: 'redux',
				label: 'Redux',
				value: 3.5,
				link: 'http://redux.js.org/index.html'
			}, {
				name: 'vuex',
				label: 'vuex',
				value: 3,
				link: 'http://vuex.vuejs.org/en/intro.html'
			}],
			type: 'list'
		}, {
			name: 'css',
			label: 'CSS',
			value: [{
				name: 'sass',
				label: 'Sass',
				value: 3,
				link: 'http://sass-lang.com/guide'
			}, {
				name: 'postcss',
				label: 'Postcss(Autoprefix only)',
				value: 1,
				link: 'http://postcss.org/'
			}, {
				name: 'bootstrap',
				label: 'Bootstrap',
				value: 2.5,
				link: 'http://v4-alpha.getbootstrap.com/getting-started/introduction/'
			}, {
				name: 'angular-material',
				label: 'Angular Material',
				value: 2.5,
				link: 'https://material.angularjs.org/latest'
			}, {
				name: 'ionic',
				label: 'Ionic',
				value: 1,
				link: 'http://ionicframework.com/docs/overview/'
			}],
			type: 'list'
		}, {
			name: 'package',
			label: 'Package',
			value: [{
				name: 'gulp',
				label: 'Gulp',
				value: 3,
				link: 'https://github.com/gulpjs/gulp/blob/master/docs/API.md'
			}, {
				name: 'webpack',
				label: 'webpack',
				value: 4,
				link: 'http://webpack.github.io/docs/'
			}],
			type: 'list'
		}, {
			name: 'node',
			label: 'Node',
			value: [{
				name: 'express',
				label: 'Express',
				value: 2,
				link: 'http://expressjs.com/en/4x/api.html'
			}, {
				name: 'koa',
				label: 'Koa',
				value: 2,
				link: 'http://koajs.com/'
			}],
			type: 'list'
		}, {
			name: 'api-design',
			label: 'API Design',
			value: [{
				name: 'rest',
				label: 'REST',
				value: 3,
				link: 'https://zh.wikipedia.org/wiki/REST'
			}, {
				name: 'graphql',
				label: 'GraphQL',
				value: 3.5,
				link: 'https://github.com/graphql/graphql-js'
			}],
			type: 'list'
		}, {
			name: 'release-tool',
			label: 'Release tool',
			value: [{
				name: 'docker',
				label: 'Docker',
				value: 3,
				link: 'https://www.docker.com/'
			}],
			type: 'list'
		}, {
			name: 'static-server',
			label: 'Static server',
			value: [{
				name: 'nginx',
				label: 'Nginx',
				value: 2,
				link: 'https://nginx.org/en/docs/'
			}],
			type: 'list'
		}],
		type: 'list'
	}
];

export default introduction;
