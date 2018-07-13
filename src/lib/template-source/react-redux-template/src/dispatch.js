

import axios from 'axios';

// 同步dispatch实例
export const dispatchChange = function (actionType) {
    const { store } = this.context;
    store.dispatch({
        type: actionType || 'change',
        data: {
            text: 'change'
        }
    });
};

// 异步dispatch实例
export const dispatchAsyncChange = function (actionType) {

    const { store } = this.context;

    axios.get('/.build/${_component}/data/asyncData.json', {
        dataType: 'json',
        contentType: 'application/json'
    }).then((res) => {
        store.dispatch({
            type: actionType || 'change',
            data: {
                text: res.data.text
            }
        });
    });
};

// 异步promise实例
export const dispatchPromiseChange = function (actionType) {
    const { store } = this.context;

    axios.get('/.build/${_component}/data/asyncData.json', {
        dataType: 'json',
        contentType: 'application/json'
    }).then((res) => {
        store.dispatch({
            type: actionType || 'change',
            data: {
                text: res.data.text
            }
        });
    });
};

