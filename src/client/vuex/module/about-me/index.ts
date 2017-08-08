/**
 * Created by jack on 16-8-15.
 */

import mutations from './mutations';
import actions from './actions';
import { Title } from 'types/page';

export class AboutMeState {
	header: Title;
	introduction: any[];
}

export default () => ({
	state: new AboutMeState(),
	actions,
	mutations
});
