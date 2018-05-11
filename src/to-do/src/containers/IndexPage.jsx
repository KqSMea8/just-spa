import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { getUrlParams } from '../utils/utils';
import Pages from './pages';

import '../style';

class IndexPage extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired
    };

    static childContextTypes = {
    };

    constructor(props) {
        super(props);
    }
    getChildContext() {
        return {
            
        };
    }
    render() {
        return (
            <div>
                <ul>
                    <li><a href="./index.html?route=welcome">欢迎</a></li>
                    <li><a href="./index.html?route=test">测试</a></li>
                    <li><a href="./index.html?route=404">404</a></li>
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
     * 根据地质路由渲染组件
     * 
     * @param {any} router 
     * @returns 
     * @memberof IndexPage
     */
    _renderComponent(router) {
        let Component;
        let routerName = getUrlParams('route', router.location.search);
        
        switch(routerName) {
            case 'welcome':
                Component = Pages.Welcome;
                break;
            case 'test':
                Component = Pages.Test;
                break;
            default:
                Component = Pages.NoMatch;
                break;
        }
        
        return Component ? <Component {...router}/> : null;
    }
}

export default IndexPage;
