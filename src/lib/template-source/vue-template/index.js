

import { change, asyncChange, promiseChange } from './src/events';

import './src/index.less';

const ${_Component} = (props) => {
    return new Vue({
        el: '#${_Component}',
        data: props,
        methods: {
            change() {
                change.call(this);
            },
            asyncChange() {
                asyncChange.call(this);
            },
            promiseChange() {
                promiseChange.call(this);
            }
        }
    });
}

export default ${_Component};

