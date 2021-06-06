import {combineReducers} from 'redux'


import user from './userReducer';
import loading from './loadingReducer';
import navbar from './navbarReducer';
import location from './locationReducer';
const rootReducer = combineReducers({ user,loading,navbar,location });

export default rootReducer;