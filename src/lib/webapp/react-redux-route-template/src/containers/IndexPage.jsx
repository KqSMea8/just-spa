import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { getUrlParams } from '../utils/utils';
import Pages from './pages';

import '../style';

// 声明container中的路由
const containerRoute = {
    'welcome': Pages.Welcome,
    'test': Pages.Test
}

class IndexPage extends React.Component {

    static propTypes = {

    };

    // 接收全局的store
    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {
            store: this.context.store
        };
    }

    render() {
        return (
            <div>
                <ul>
                    <li><a href="./index.html#welcome">欢迎</a></li>
                    <li><a href="./index.html#test">测试</a></li>
                    <li><a href="./index.html#404">404</a></li>
                </ul>
                <Router path='/www/'>
                    <Switch>
                        <Route exact name="首页" path="/www/" component={this._renderComponent} />
                        <Route exact name="首页" path="/www/index.html" component={this._renderComponent} />
                    </Switch>
                </Router>
            </div>
        );
    }

    /**
     * 根据hash路由渲染组件
     * 
     * @param {any} router 
     * @returns 
     * @memberof IndexPage
     */
    _renderComponent(router) {
        let Component;
        let routerName = router.location.hash.replace('#', '');

        Component = containerRoute[routerName] || Pages.NoMatch
        
        return Component ? <Component {...router}/> : null;
    }
}

export default IndexPage;
