import { AUTH_USER } from './actions'

const INIT_STATE = {
    isLogin: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case AUTH_USER:
            return {...state, isLogin: action.payload};
        default:
            return {...state};
    }
}