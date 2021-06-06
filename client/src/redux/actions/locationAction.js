import { setInStorage } from '../../helpers/storage';
import * as constants from '../constants'

export const changeLocation = (data, onSuccess, onError) => ({
    type: constants.SET_LOCATION,
    payload: {
        data,
        success: (response) => (setLocation(response)),
        postProcessSuccess: onSuccess,
        postProcessError: onError
    }
});

const setLocation = (data) =>{
    const location = JSON.parse(data.location)
    setInStorage('location',JSON.stringify(location));
    return{type: constants.SET_LOCATION, payload:location}
};