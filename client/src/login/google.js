import React,{useState,useEffect} from 'react'
import GoogleLogin from "react-google-login";
import Swal from "sweetalert2";
import {Redirect,useHistory} from 'react-router-dom'
import { connect } from 'react-redux';
import { GoogleLoginUser } from '../redux/actions/authActionCreators';

const Google = ({dispatchGoogleLoginAction}) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [userDetails, setUserDetails] = useState("")
  const history = useHistory();

  const responseSuccessGoogle = (response) => {
    setIsUserLoggedIn(true);
    setUserDetails(response.profileObj)
    const GoogleUser = {
      Email: userDetails.email,
      FirstName: userDetails.givenName,
      LastName: userDetails.familyName,
      Password: "GooglePassword",
    };
    console.log(response);


    dispatchGoogleLoginAction(response.tokenId,
      () => Swal.fire({
        position: "center",
        icon: "success",
        title: "נרשמת בהצלחה",
        showConfirmButton: false,
        timer: 1200,
      }), console.log("Account created successfully"),
      (message) => console.log(`Error:  ${message}`))

<<<<<<< HEAD
      history.push("/user");
    }
=======
     history.push('/user')
  }
>>>>>>> masterbranch
  const responseErrorGoogle=(response)=>{

  }

  return (
    <div className="googleDiv">
    {!isUserLoggedIn && (
      <GoogleLogin
        clientId="894154508942-abj25d49dcrkjigeei6a5hedmjn2cu19.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
        className="btnG"
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            type="button"
            className="loginBtn loginBtn--google"
          >
            <span className="">התחבר עם גוגל</span>
          </button>
        )}
        buttonText="Login With Google"
        onSuccess={responseSuccessGoogle}
        onFailure={responseErrorGoogle}
        cookiePolicy={'single_host_origin'}
      />
    )}
  </div>
  )
}

const mapDispatchToProps = dispatch => ({
  dispatchGoogleLoginAction: (tokenId, onSuccess, onError) =>
    dispatch(GoogleLoginUser({ tokenId }, onSuccess, onError))
})
export default connect(null, mapDispatchToProps)(Google)
