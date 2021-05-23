import {combineReducers} from 'redux'


import user from './userReducer';
import loading from './loadingReducer';
import navbar from './navbarReducer';
const rootReducer = combineReducers({ user,loading,navbar });

export default rootReducer;