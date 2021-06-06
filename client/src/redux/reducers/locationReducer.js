import { getFromStorage } from '../../helpers/storage';
import * as constants from '../constants';

const defaultState = {
    location:{
        lat:32.79931431934253,
        lng:34.98862649607837
    }
};
//32.79931431934253, 34.98862649607837
const location = getFromStorage('location');
const INITIAL_STATE = location ? JSON.parse(location) : defaultState;


export default function  locationReducer(state = INITIAL_STATE, action){
    switch (action.type) {
        case constants.SET_LOCATION:
            return {...action.payload};
            case constants.RESET_LOCATION:
                    return {...defaultState}
        default:
            return state;
    }
}