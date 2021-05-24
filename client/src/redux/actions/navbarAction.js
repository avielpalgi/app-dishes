import { setInStorage } from '../../helpers/storage';
import * as constants from '../constants'

export const changeNav = (data, onSuccess, onError) => ({
    type: constants.SET_NAVBAR,
    payload: {
        data,
        success: (response) => (setNavbar(response)),
        postProcessSuccess: onSuccess,
        postProcessError: onError
    }
});

const setNavbar = (data) =>{
    const navBar = JSON.parse(data.navbar)
    setInStorage('NavBar',JSON.stringify(navBar));
    return{type: constants.SET_NAVBAR, payload:navBar}
};