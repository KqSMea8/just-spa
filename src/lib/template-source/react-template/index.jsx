
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { change, asyncChange, promiseChange } from './src/events';

import './src/index.less';

class ${_Component} extends PureComponent {

    static propTypes = {
        text: PropTypes.string,
        name: PropTypes.string
    }

    // 必须要定义contextType，否则无法获取Provider的context
    static contextTypes = {
        store: React.PropTypes.object
    }

    constructor(props) {
        super();
        this.state = {
            text: props.text,
            name: props.name
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        const className = '${_component}';

        return <div className={className}>
        <h2>纯react模板组件: ${_Component}</h2>
            {this.state.text} {this.state.name}!
                <button onClick={change.bind(this)}>Sync change</button>
            <button onClick={asyncChange.bind(this)}>Async change</button>
            <button onClick={promiseChange.bind(this)}>Promise change</button>
        </div>
    }

    componentWillReceiveProps(nextProps, props) {

    }

    componentWillUpdate() {

    }

    componentDidUpdate() {

    }

    componentDidCatch() {

    }
}

export default ${_Component};