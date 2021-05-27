
import React, { useState,useEffect } from 'react';
import FacebookLoginBtn from 'react-facebook-login';
import Swal from "sweetalert2";
import { connect } from 'react-redux';
import { FacebookLogin, registerUser } from '../redux/actions/authActionCreators';

const Facebook = ({dispatchFacebookLoginAction}) => {
    const [Email, setEmail] = useState("")
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Picture, setPicture] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [accessToken, setAccessToken] = useState("")
    const [userID, setUserID] = useState("")
    const componentClicked = () => {
    }
    const responseFacebook = (response) => {
        dispatchFacebookLoginAction(response.accessToken,response.userID,
            () => Swal.fire({
              position: "center",
              icon: "success",
              title: "נרשמת בהצלחה",
              showConfirmButton: false,
              timer: 1200,
            }), console.log("Account created successfully"),
            (message) => console.log(`Error:  ${message}`))
    }
  
        return (
            <div className="FacebookBTN">
                {/* {fbContent} */}
                <FacebookLoginBtn
                    appId="584439855868380" //Facebook Developer ID
                    //scope="public_profile, email"
                    autoLoad={false}
                    //fields="email,first_name,last_name,picture.width(280).height(280)"
                    //onClick={componentClicked}
                    callback={responseFacebook} 
                    cssClass="loginBtn loginBtn--facebook"
                    cookie={true}
                    xfbml={true}
                    isMobile={false}
                    textButton="התחבר עם פייסבוק"
                    />
            </div>
        );
}


const mapDispatchToProps = dispatch => ({
    dispatchFacebookLoginAction: (accessToken,userID, onSuccess, onError) =>
      dispatch(FacebookLogin({ accessToken,userID }, onSuccess, onError))
  })
  export default connect(null, mapDispatchToProps)(Facebook)