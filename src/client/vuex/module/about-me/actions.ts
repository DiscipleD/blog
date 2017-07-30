/**
 * Created by jack on 16-8-16.
 */

import { ActionContext } from 'vuex';

import { createAction } from '../../common/actionHelper';
import { RootState } from '../index';
import { AboutMeState } from './index';
import { SET_BLOG_TITLE } from '../site/actions';
import image from 'assets/img/about-bg.jpg';
import introduction from './introductions.json';

export const INIT_ABOUT_ME_PAGE = 'INIT_ABOUT_ME_PAGE';

const initAboutPage = ({commit}: ActionContext<AboutMeState, RootState>) => {
	commit(createAction(SET_BLOG_TITLE, 'About D.D'));
	commit(createAction(INIT_ABOUT_ME_PAGE, {
		header: {
			image,
			title: 'About D.D',
			subtitle: 'Disciple.Ding'
		},
		introduction
	}));
};

export default {initAboutPage};
