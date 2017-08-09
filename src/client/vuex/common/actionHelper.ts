/**
 * Created by jack on 16-8-16.
 */

import { Store, ActionContext } from 'vuex';

import { IRootState } from '../module';

export interface IMutation {
	type: string;
	payload: any;
}

const createAction = (typeName: string = '', data?: any): IMutation => ({ type: typeName, payload: data });

const getActionContext = <T, S>(module: string, store: any): ActionContext<T, S> => {
	return {
		dispatch: (key: string, payload: any) => store.dispatch(key, payload, module),
		commit: (key: string, payload: any) => store.commit(key, payload, module),
		state: store.state[module],
		getters: store.getters,
		rootState: store.state,
		rootGetters: store.getters,
	};
};

export { createAction, getActionContext };
