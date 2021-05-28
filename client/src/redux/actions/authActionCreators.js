import { setInStorage } from '../../helpers/storage';
import * as constants from '../constants'

export const registerUser = (data, onSuccess, onError) => ({
    type: constants.API,
    payload: {
        method: 'POST',
        url: '/app/users/register',
        data,
        success: (response) => (setUserInfo(response)),
        postProcessSuccess: onSuccess,
        postProcessError: onError
    }
});

export const FacebookLogin = (data, onSuccess, onError) => ({
    type: constants.API,
    payload: {
        method: 'POST',
        url: '/app/users/facebookLogin',
        data,
        success: (response) => (setUserInfo(response)),
        postProcessSuccess: onSuccess,
        postProcessError: onError
    }
});

export const GoogleLoginUser = (data, onSuccess, onError) => ({
    type: constants.API,
    payload: {
        method: 'POST',
        url: '/app/users/googleLogin',
        data,
        success: (response) => (setUserInfo(response)),
        postProcessSuccess: onSuccess,
        postProcessError: onError
    }
});

export const loginUser = (data,onSuccess,onError)=>({
    type: constants.API,
    payload:{
        method:'POST',
        url: '/app/users/login',
        data,
        success: (response) =>(setUserInfo(response)),
        postProcessSuccess:onSuccess,
        postProcessError:onError
    }
});

export const logoutUser = () =>{
    localStorage.removeItem('USER_INFO');
    return {type: constants.RESET_USER_INFO};
};

export const loading = (obj) =>{
    if (!obj) {
        return {type: constants.TOGGLE_LOADER};
    }
    else{
        return {type: constants.TOOGLE_STOP};
    }
};

const setUserInfo = (data) =>{
    const parsedToken = JSON.parse(atob(data.token.split('.')[1]))
    if (parsedToken.Picture) {
        const userInfo = {
            userId: parsedToken.id,
            fullName: `${parsedToken.FirstName} ${parsedToken.LastName}`,
            token:data.token,
            isLoggedIn:true,
            picture:parsedToken.Picture
        };
        setInStorage('USER_INFO',JSON.stringify(userInfo));
        return{type: constants.SET_USER_INFO, payload:userInfo}
    }
    else{
        const userInfo = {
            userId: parsedToken.id,
            fullName: `${parsedToken.FirstName} ${parsedToken.LastName}`,
            token:data.token,
            isLoggedIn:true
        };
        setInStorage('USER_INFO',JSON.stringify(userInfo));
        return{type: constants.SET_USER_INFO, payload:userInfo}
    }
    

    // setInStorage('USER_INFO',JSON.stringify(userInfo));
    // return{type: constants.SET_USER_INFO, payload:userInfo}
};