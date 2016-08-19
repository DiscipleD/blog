/**
 * Created by jack on 16-8-16.
 */

const createAction = (typeName = '', data = '') => ({ type: typeName, payload: data });

export { createAction };
