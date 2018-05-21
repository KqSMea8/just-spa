import React from 'react';
import {assert, expect} from 'chai';
import Enzyme, {shallow, render, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import add from './add.js';

import ${_Component} from '../index.jsx';
import initProps from '../data/index';

Enzyme.configure({ adapter: new Adapter() });

describe('<${_Component} {...initProps}/>', () => {
    it('should render ${_Component} success', () => {
        const wrapper = shallow(<${_Component} {...initProps}/>,  { context: { store: {
            text: 'hello'
        } } });
        expect([1,2,3]).to.have.length(3);
    });
})

describe('加法函数的测试demo', function () {
    it('1 加 1 应该等于 2', function () {
        expect(add(1, 1)).to.be.equal(2);
    });
});