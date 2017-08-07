/**
 * Created by jack on 16-8-27.
 */
import { Route } from 'vue-router';

import browser, { BrowserState } from './browser';
import home, { HomeState } from './home';
import aboutMe, { AboutMeState } from './about-me';
import post, { PostState } from './post';
import site, { SiteState } from './site';
import tags, { TagsState } from './tags';

export interface RootState {
	browser: BrowserState,
	home: HomeState,
	aboutMe: AboutMeState,
	post: PostState,
	site: SiteState,
	tags: TagsState
	route: Route
}

export default {
	browser,
	site,
	aboutMe,
	home,
	post,
	tags
};
