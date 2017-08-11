/**
 * Created by jack on 16-8-27.
 */
import { Route } from 'vue-router';

import BrowserModule, { BrowserState } from './browser';
import HomeModule, { HomeState } from './home';
import AboutMeModule, { AboutMeState } from './about-me';
import PostModule, { PostState } from './post';
import SiteModule, { SiteState } from './site';
import TagsModule, { TagsState } from './tags';

export interface IRootState {
	browser: BrowserState;
	home: HomeState;
	aboutMe: AboutMeState;
	post: PostState;
	site: SiteState;
	tags: TagsState;
	route: Route;
}

export default () => ({
	browser: new BrowserModule(),
	site: new SiteModule(),
	aboutMe: new AboutMeModule(),
	home: new HomeModule(),
	post: new PostModule(),
	tags: new TagsModule(),
});
