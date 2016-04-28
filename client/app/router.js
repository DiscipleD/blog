/**
 * Created by jack on 16-4-21.
 */

import Home from './home/home';
import About from './about/about';
import Components from '../component';

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
		component: Components.Post
	}
};

export default Router;
