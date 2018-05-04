
module.exports = function reactTemplate(componentName) {
    return `import React from 'react';
import ReactDOM from 'react-dom';

import {AppContainer} from 'react-hot-loader';

// 引入组件
import Component from '../.build/${componentName}/entry';
import template from '../.build/${componentName}/template';
import '../.build/${componentName}/style';

// 直接引用组件的用法
const render = (Component) => {
    ReactDOM.render((
        <AppContainer>
            {Component}
        </AppContainer>
    ), document.getElementById('root'));
};

document.getElementById('template').outerHTML = template;

render(Component);

// 进行热替换调试组件内容
if (module.hot && process.env.NODE_ENV !== 'production') {

    module.hot.accept([
        '../.build/${componentName}/index',
        '../.build/${componentName}/entry'
    ], (err) => {
        if (err) {
            console.log(err);
        }
        const NextComponent = require('../.build/${componentName}/entry').default;

        render(NextComponent);
    });
};`

}