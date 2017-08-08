/**
 * Created by jack on 16-8-27.
 */
import { Route } from 'vue-router';

import createBrowserModule, { BrowserState } from './browser';
import createHomeModule, { HomeState } from './home';
import createAboutMeModule, { AboutMeState } from './about-me';
import createPostModule, { PostState } from './post';
import createSiteModule, { SiteState } from './site';
import createTagsModule, { TagsState } from './tags';

export interface RootState {
	browser: BrowserState,
	home: HomeState,
	aboutMe: AboutMeState,
	post: PostState,
	site: SiteState,
	tags: TagsState
	route: Route
}

export default () => ({
	browser: createBrowserModule(),
	site: createSiteModule(),
	aboutMe: createAboutMeModule(),
	home: createHomeModule(),
	post: createPostModule(),
	tags: createTagsModule()
});
