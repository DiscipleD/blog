/**
 * Created by jack on 16-4-21.
 */

import Home from './home/home';
import About from './about/about';
import Post from './post/post';

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
	'/posts/:postName': {
		component: Post,
		waitForData: true
	}
};

export default Router;
