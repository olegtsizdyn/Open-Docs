import { NAV } from './actions'

const INIT_STATE = {
    navToggle: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case NAV:
            return {...state, navToggle: action.payload};
        default:
            return {...state};
    }
}