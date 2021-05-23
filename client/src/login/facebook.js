
import React, { Component } from 'react';
import FacebookLoginBtn from 'react-facebook-login';
import Swal from "sweetalert2";

class Facebook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            email: '',
            firstName: '',
            lastName: "",
        }
    }
    componentClicked = () => {
    }
    responseFacebook = (response) => {
        if (response.email !== null && response.email !== undefined) {
            this.setState({
                isLoggedIn: true,
                email: response.email,
                firstName: response.first_name,
                lastName: response.last_name,
            });
        }
        else{
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error with facebook',
                showConfirmButton: true,
                timer: 1800
            });
        }
    }
    userEnter = () => {
        const FacebookUser = {
            Email: this.state.email,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Password: "facebookUser",
        }
    }

    render() {
        let fbContent;
        this.state.isLoggedIn ?
            fbContent = (
                <div>{this.userEnter()}</div>
            ) :
            fbContent = (
                <FacebookLoginBtn
                    appId="" //Facebook Developer ID
                    scope="public_profile, email"
                    autoLoad={false}
                    fields="email,first_name,last_name,picture.width(280).height(280)"
                    onClick={this.componentClicked}
                    callback={this.responseFacebook} 
                    cssClass="loginBtn loginBtn--facebook"
                    cookie={true}
                    xfbml={true}
                    isMobile={false}
                    textButton="התחבר עם פייסבוק"
                    />
            );

        return (
            <div className="FacebookBTN">
                {fbContent}
            </div>
        );
    }
}

export default Facebook;