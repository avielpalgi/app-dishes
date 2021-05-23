import React, { Component } from "react";
import GoogleLogin from "react-google-login";
class Google extends Component {
  constructor() {
    super();
    this.state = {
      userDetails: {},
      isUserLoggedIn: false,
    };
  }

  responseGoogle = (response) => {
    this.setState({ userDetails: response.profileObj, isUserLoggedIn: true });
    const GoogleUser = {
      Email: this.state.userDetails.email,
      FirstName: this.state.userDetails.givenName,
      LastName: this.state.userDetails.familyName,
      Password: "GooglePassword",
    };
  };

  render() {
    return (
      <div className="googleDiv">
        {!this.state.isUserLoggedIn && (
          <GoogleLogin
            clientId="" //CLIENTID NOT CREATED YET
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
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          />
        )}
      </div>
    );
  }
}

export default Google;
