/**
 * Created by jack on 16-8-15.
 */

import mutations from './mutations';
import actions from './actions';
import { Title } from 'types/page';

export interface AboutMeState {
	header: Title,
	introduction: any[]
}

export default {
	state: {
		header: {},
		introduction: null
	},
	actions,
	mutations
};
