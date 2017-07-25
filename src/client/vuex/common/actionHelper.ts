/**
 * Created by jack on 16-8-16.
 */

export interface Mutation {
    type: string,
    payload: any
}

const createAction = (typeName: string = '', data?: any): Mutation => ({ type: typeName, payload: data });

export { createAction };
