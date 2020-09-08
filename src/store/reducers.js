import { combineReducers } from 'redux'
import authReducer from './auth/reducers'
import navToggle from './nav/reducers'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
    auth: authReducer,
    nav: navToggle,
    form: formReducer
})