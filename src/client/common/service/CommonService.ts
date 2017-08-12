/**
 * Created by jack on 16-12-17.
 */

import {BLOG_TITLE} from 'common/constant/site';
import {setPageTitle} from 'common/util/dom';

export const getBlogTitle = (str: string) => {
	if (!str || str === BLOG_TITLE) return BLOG_TITLE;
	else return `${str} | ${BLOG_TITLE}`;
};

export const setBlogTitle = (str: string) => {
	setPageTitle(getBlogTitle(str));
};
