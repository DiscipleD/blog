/**
 * Created by jack on 16-8-27.
 */

import createBrowserModule from './browser';
import createHomeModule from './home';
import createAboutMeModule from './about-me';
import createPostModule from './post';
import createSiteModule from './site';
import createTagsModule from './tags';

export default () => ({
	browser: createBrowserModule(),
	site: createSiteModule(),
	aboutMe: createAboutMeModule(),
	home: createHomeModule(),
	post: createPostModule(),
	tags: createTagsModule()
});
