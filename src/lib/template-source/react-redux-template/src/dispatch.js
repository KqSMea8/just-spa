

import axios from 'axios';

// 同步dispatch实例
export const dispatchChange = function () {
    const { store } = this.context;
    store.dispatch({
        type: 'change',
        data: {
            text: 'change'
        }
    });
};

// 异步dispatch实例
export const dispatchAsyncChange = function () {

    const { store } = this.context;

    axios.get('/.build/${_Component}/data/asyncData.json', {
        dataType: 'json',
        contentType: 'application/json'
    }).then((res) => {
        store.dispatch({
            type: 'change',
            data: {
                text: res.data.text
            }
        });
    });
};

// 异步promise实例
export const dispatchPromiseChange = function () {
    const { store } = this.context;

    axios.get('/.build/${_Component}/data/asyncData.json', {
        dataType: 'json',
        contentType: 'application/json'
    }).then((res) => {
        store.dispatch({
            type: 'change',
            data: {
                text: res.data.text
            }
        });
    });
};

