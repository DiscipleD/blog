/**
 * Created by jack on 16-8-20.
 */

import { Store } from 'vuex';

import {createAction} from '../../common/actionHelper';

export const LOAD_BROWSER_SETTING = 'LOAD_BROWSER_SETTING';

const loadBrowserSetting = ({commit}: Store<any>) => {
	const browser = {
		clientWidth: document.body.clientWidth
	};
	commit(createAction(LOAD_BROWSER_SETTING, browser));
};

export default {loadBrowserSetting};
