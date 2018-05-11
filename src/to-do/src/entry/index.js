import React from 'react';
import {applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';

import IndexPage from '../containers/IndexPage';
// import reducers from '../reducers';

import ReactDOM from 'react-dom';


// 支持redux调试
import { composeWithDevTools } from 'redux-devtools-extension';

// import { Route, Switch, Link } from 'react-router-dom';

import {AppContainer} from 'react-hot-loader';

// 引入组件
// import '../style.less';

let initStore = {}; //require('../.build/${componentName}/data').default || {};

let middlewares = [reduxThunk, reduxPromise];

const reducer = (state = {}, action) => {
    switch (action.type) {
        default:
            return Object.assign({}, state, action.data);
    }
};

const store = createStore(reducer, initStore, composeWithDevTools(applyMiddleware(...middlewares)));

// 直接引用组件的用法
const render = (Component) => {
    ReactDOM.render((
        <AppContainer>
            <Provider store={store}>
                <Component/>
            </Provider>
        </AppContainer>
    ), document.getElementById('pageRoot'));
};


render(IndexPage);

// 进行热替换调试组件内容
if (module.hot && process.env.NODE_ENV !== 'production') {

    module.hot.accept([
        '../containers/IndexPage'
    ], (err) => {
        if (err) {
            console.log(err);
        }
        const NextComponent = require('../containers/IndexPage').default;

        render(NextComponent);
    });
}

// let context = ReduxContext
//     .forDOM()
//     .configureStore(reducers)
//     .render(IndexPage, { apiClass: WebApi }, { warnings: false });

// if (module.hot) {
//     module.hot.accept('../reducers', () => {
//         context.replaceReducer(combineReducers(require('../reducers').default))
//     });
//     module.hot.accept(['../containers/IndexPage', '../api/PlayWebApi'], () => {
//         context.render(IndexPage, { apiClass: WebApi }, { warnings: false });
//     });
// }
