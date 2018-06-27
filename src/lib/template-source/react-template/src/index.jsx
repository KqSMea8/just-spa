
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { change, asyncChange, promiseChange } from './events';

class ${_Component} extends PureComponent {

    static propTypes = {
        text: PropTypes.string,
        name: PropTypes.string
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
}

export default ${_Component};
