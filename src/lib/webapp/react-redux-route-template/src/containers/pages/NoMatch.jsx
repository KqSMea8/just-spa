import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

class NoMatch extends PureComponent {
    // 接收全局的store
    static contextTypes = {
        store: PropTypes.object.isRequired
    }
    
    componentDidMount() {

        // 异步promise实例
        function dispatchPromiseChange(actionType) {
            const { store } = this.context;
            const actionCreator = function (actionType) {

                return (dispatch, getState) => new Promise(function (resolve, reject) {
                    return axios.get('./mock/index.json', {
                        dataType: 'json',
                        contentType: 'application/json'
                    }).then((res) => {
                        dispatch({
                            type: actionType,
                            data: {
                                text: res.data.text
                            }
                        });
                    });
                });
            }
            store.dispatch(actionCreator(actionType));
        }
        dispatchPromiseChange.bind(this)('change');
    }
    
    render() {
        return (<div>
            <h2>{this.props.text}</h2>
            <hr />
            <p>404页面</p>
        </div>);
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        text: state.index.text
    };
}

const mapDispatchToProps = (state, ownProps) => {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoMatch)
