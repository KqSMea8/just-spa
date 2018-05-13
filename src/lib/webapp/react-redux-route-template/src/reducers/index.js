import * as ActionTypes from '../actions';


const index = (state = {}, action) => {
    switch (action.type) {
        default:
            return Object.assign({}, state, action.data);
    }
};

export default {
    index
}