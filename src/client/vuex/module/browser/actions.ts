/**
 * Created by jack on 16-8-20.
 */

import { ActionContext } from 'vuex';

import { createAction } from '../../common/actionHelper';
import { RootState } from '../index';
import { BrowserState } from './index';

export const LOAD_BROWSER_SETTING = 'LOAD_BROWSER_SETTING';

const loadBrowserSetting = ({commit}: ActionContext<BrowserState, RootState>) => {
	const browser = {
		clientWidth: document.body.clientWidth
	};
	commit(createAction(LOAD_BROWSER_SETTING, browser));
};

export default {loadBrowserSetting};
