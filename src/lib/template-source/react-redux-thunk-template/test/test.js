import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import ${_Component} from '../src/index.jsx';
import initProps from '../data/index';

import reducer from '../src/reducer';
import { dispatchAsyncChange } from '../src/action';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';

const store = createStore(reducer, {}, applyMiddleware(...[reduxThunk, reduxPromise]));

Enzyme.configure({ adapter: new Adapter() });


// component 测试
describe('<${_Component} {...initProps}/> 组件测试', () => {
    it('should render ${_Component} success', () => {
        const wrapper = shallow(<Provider store={store}>
            <${_Component} store={store} />
        </Provider>, initProps);
    });
});

// reducer测试
describe('<${_Component}> Action测试', () => {
    it('Test Action success', () => {

        let promise = dispatchAsyncChange.bind({
            context: {
                store: store
            }
        })('change');

        return promise.then(() => {
            let change = store.getState();

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<${_Component}> reducer测试', () => {
    it('Test reducer success', () => {

        let changeState = reducer({}, {
            type: 'change',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
