/**
 * Created by jack on 16-8-15.
 */

import { Title } from 'types/page';
import mutations from './mutations';
import actions from './actions';

export class TagsState {
	header: Title;
	list: Array<any>;
	isLoading: boolean;
	constructor() {
		this.isLoading = false;
	}
}

export default () => ({
	state: new TagsState(),
	actions,
	mutations
});
