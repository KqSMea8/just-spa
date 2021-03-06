
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ComponentPage from '../../components/component-page';

import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
import { formatName } from './data-adapter';

class MainPage extends PureComponent {

    static propTypes = {
        text: PropTypes.string,
        name: PropTypes.string
    }

    // 必须要定义contextType，否则无法获取Provider的context
    static contextTypes = {
        store: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    render() {
        const className = 'main-page';

        const formatNameData = formatName(this.props.name);

        return <div className={className}>
            <h2>react-redux模板组件：MainPage</h2>
            {this.props.text} {formatNameData}!
            <button onClick={() => {
                dispatchChange.bind(this)('MainPage');
            }}>同步dispatch</button>
            <button onClick={() => {
                dispatchAsyncChange.bind(this)('MainPage');
            }}>异步dispatch</button>
            <button onClick={() => {
                dispatchPromiseChange.bind(this)('MainPage');
            }}>Promise dispatch</button>
            <ComponentPage />
        </div>
    }
}

export default MainPage;
