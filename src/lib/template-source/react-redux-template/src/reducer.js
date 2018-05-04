

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'change':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default reducer;