import { combineReducers } from 'redux'
import authReducer from './auth/reducers'
import navToggle from './nav/reducers'

export default combineReducers({
    auth: authReducer,
    nav: navToggle
})