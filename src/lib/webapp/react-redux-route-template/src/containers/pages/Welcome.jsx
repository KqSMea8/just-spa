import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

class Welcome extends PureComponent {
    // 接收全局的store
    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    componentDidMount = () => {
        dispatchChange.bind(this)({
            text: 'hello first and change world'
        });
        // 同步dispatch实例
        function dispatchChange(data) {
            const { store } = this.context;
            const actionCreator = (actionType) => {
                return (dispatch, getState) => {
                    dispatch({
                        type: actionType,
                        data: data
                    });
                };
            }
            store.dispatch(actionCreator('change'));
        }
    }

    render() {
        return (
            <div>
                <h2>{this.props.text}</h2>
                <hr />
                <p>欢迎页面</p>
            </div>
        );
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
)(Welcome)