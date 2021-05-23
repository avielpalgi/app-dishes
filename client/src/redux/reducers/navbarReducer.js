import { getFromStorage } from '../../helpers/storage';
import * as constants from '../constants';

const defaultState = {
   navbar:false
};

const navBar = getFromStorage('NavBar');
const INITIAL_STATE = navBar ? JSON.parse(navBar) : defaultState;


export default function  navbarReducer(state = INITIAL_STATE, action){
    switch (action.type) {
        case constants.SET_NAVBAR:
            return {...action.payload};
            case constants.RESET_NAVBAR:
                    return {...defaultState}
        default:
            return state;
    }
}