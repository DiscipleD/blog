/**
 * Created by jack on 16-8-15.
 */

import { Title } from 'types/page';
import mutations from './mutations';
import actions from './actions';

export interface TagsState {
	header: Title,
	list: Array<any>,
	isLoading: boolean
}

export default {
	state: {
		header: {},
		list: [],
		isLoading: false
	},
	actions,
	mutations
};
