/**
 * Created by jack on 16-12-17.
 */

import { BLOG_TITLE } from 'common/constant/site';
import {setPageTitle} from 'common/util/DOM';


export const setBlogTitle = str => {
	if (!str) setPageTitle(BLOG_TITLE);
	else setPageTitle(`${str} | ${BLOG_TITLE}`);
};
