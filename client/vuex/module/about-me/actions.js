/**
 * Created by jack on 16-8-16.
 */

import {createAction} from '../../common/actionHelper';
import {INIT_ABOUT_ME_PAGE} from './mutation_types';
import image from 'assets/img/about-bg.jpg';
import introduction from './introductions';

const initAboutPage = ({commit}) => {
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
