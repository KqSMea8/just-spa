

import axios from 'axios';

// 同步change实例
export const change = function () {
    this.setState ({
        text: 'change'
    });
};

// 异步change实例
export const asyncChange = function () {
    const self = this;
    axios.get('/.build/${_component}/data/asyncData.json', {
        dataType: 'json',
        contentType: 'application/json'
    }).then((res) => {
        self.setState({
            text: res.data.text
        });
    }, (err) => {
        console.log(err);
    });
};

// 异步change实例
export const promiseChange = function () {
    const self = this;
    new Promise(function (resolve, reject) {
        return axios.get('/.build/${_component}/data/asyncData.json', {
            dataType: 'json',
            contentType: 'application/json'
        }).then((res) => {
            self.setState({
                text: res.data.text
            });
        }, (err) => {
            console.log(err);
        });
    });
};
