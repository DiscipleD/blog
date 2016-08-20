/**
 * Created by jack on 16-8-20.
 */

import {createAction} from '../../common/actionHelper';
import {LOAD_BROWSER_SETTING} from './mutation_types';

const loadBrowserSetting = ({commit}) => {
	const browser = {
		clientWidth: document.body.clientWidth
	};
	commit(createAction(LOAD_BROWSER_SETTING, browser));
};

export default {loadBrowserSetting};
