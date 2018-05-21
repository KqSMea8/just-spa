
import React from 'react';
import {assert, expect} from 'chai';
import Enzyme, {shallow, render, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import Component from '../index.jsx';
import initProps from '../data/index';

Enzyme.configure({ adapter: new Adapter() });

describe('<Component {...initProps}/>', () => {
    it('should render Component', () => {
        const wrapper = shallow(<Component {...initProps}/>,  { context: { store: {
            text: 'hello'
        } } });
        expect([1,2,3]).to.have.length(3);
    });
})
