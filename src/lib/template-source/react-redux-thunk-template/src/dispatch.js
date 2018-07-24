

import axios from 'axios';

// 同步dispatch实例
export const dispatchChange = function (actionType) {
    const { store } = this.context;
    const actionCreator = (actionType) => {
        return (dispatch, getState) => {
            dispatch({
                type: actionType || 'change',
                data: {
                    text: 'change'
                }
            });
        };
    }
    store.dispatch(actionCreator(actionType));
};

// 异步dispatch实例
export const dispatchAsyncChange = function (actionType) {

    const { store } = this.context;

    const actionCreator = function (actionType) {
        return (dispatch, getState) => {
            return axios.get('/.build/${_component}/data/asyncData.json', {
                dataType: 'json',
                contentType: 'application/json'
            }).then((res) => {
                dispatch({
                    type: actionType || 'change',
                    data: {
                        text: res.data.text
                    }
                });
            }, (err) => {
                console.log(err);
            });
        };
    }

    store.dispatch(actionCreator(actionType));
};

// 异步promise实例
export const dispatchPromiseChange = function (actionType) {
    const { store } = this.context;
    const actionCreator = function (actionType) {

        return (dispatch, getState) => new Promise(function (resolve, reject) {
            return axios.get('/.build/${_component}/data/asyncData.json', {
                dataType: 'json',
                contentType: 'application/json'
            }).then((res) => {
                dispatch({
                    type: actionType || 'change',
                    data: {
                        text: res.data.text
                    }
                });
            }, (err) => {
                console.log(err);
            });
        });
    }

    store.dispatch(actionCreator(actionType));
};

