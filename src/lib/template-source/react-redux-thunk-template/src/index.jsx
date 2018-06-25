
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './dispatch';

// import './index.less';

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
        this.state = {};
    }

    render() {
        const className = '${_component}';

        return <div className={className}>
            <h2>react-redux-thunk模板组件：${_Component}</h2>
            {this.props.text} {this.props.name}!
                <button onClick={dispatchChange.bind(this)}>Sync change</button>
            <button onClick={dispatchAsyncChange.bind(this)}>Async change</button>
            <button onClick={dispatchPromiseChange.bind(this)}>Promise change</button>
        </div>
    }
}

export default ${_Component};