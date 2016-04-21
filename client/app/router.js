/**
 * Created by jack on 16-4-21.
 */

import Home from './home/home';
import Posts from './posts/posts';
import About from './about/about';

const Router = {
	'/': {
		component: Home
	},
	'/about': {
		component: About
	},
	'/home': {
		component: Home
	},
	'/posts': {
		component: Posts
	}
};

export default Router;
