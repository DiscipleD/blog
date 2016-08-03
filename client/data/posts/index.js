/**
 * Created by jack on 16-4-26.
 */

import angularStyleguide from './angular1.5-with-ES6-styleguide';
import angularProvide from './angular-provide';
import autoprefixer from './autoprefixer';
import browersync from './browsersync';
import cssFlex from './css-flex';
import decorator from './decorator-design-pattern';
import doesCurryHelp from './does-curry-help';
import gettingStartedWithRedux from './getting-started-with-redux';
import graphqlCoreConcepts from './graphql-core-concepts';
import graphqlJSEntry from './graphql-js-entry';
import es6 from './es2015';
import jsDoc from './js-doc';
import ocLazyLoad from './ocLazyLoad';
import privateNpmServer from './private-npm-server';
import reduxAdvanced from './redux-advanced';
import curryHelps from './why-curry-helps';

let posts = [];

posts.push(angularStyleguide);
posts.push(angularProvide);
posts.push(autoprefixer);
posts.push(browersync);
posts.push(cssFlex);
posts.push(decorator);
posts.push(doesCurryHelp);
posts.push(gettingStartedWithRedux);
posts.push(graphqlCoreConcepts);
posts.push(graphqlJSEntry);
posts.push(es6);
posts.push(jsDoc);
posts.push(ocLazyLoad);
posts.push(privateNpmServer);
posts.push(reduxAdvanced);
posts.push(curryHelps);

posts.sort((a, b) => {
	return a.createdTime > b.createdTime ? -1 : 1;
});

// 暂时由静态目录通过 webpack 的文件引入为对象的方式来管理 Post
// 后期可直接将这部分移植至 database
export default posts;
