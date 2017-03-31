/**
 * Created by jack on 16-12-17.
 */

import {BLOG_TITLE} from 'common/constant/site';
import {setPageTitle} from 'common/util/DOM';

export const getBlogTitle = str => {
	if (!str || str === BLOG_TITLE) return BLOG_TITLE;
	else return `${str} | ${BLOG_TITLE}`;
};

export const setBlogTitle = str => {
	setPageTitle(getBlogTitle(str));
};

export const isSupportShareAPI = () => !!navigator.share;

export const sharePage = () => {
	navigator
		.share({
			title: document.title,
			url: window.location.href
		})
		.then(() => console.info('Successful share.'))
		.catch(error => console.log('Error sharing:', error));
};
