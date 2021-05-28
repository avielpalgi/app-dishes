import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter, Link } from 'react-router-dom'
import { logoutUser } from '../redux/actions/authActionCreators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSignOutAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import Edit from './Edit';
import './user.css';
import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

// set response language. Defaults to english.
Geocode.setLanguage("en");
const User = ({ navbar, user, dispatchLogoutAction }) => {
    const login = () => {

    }
    
// Get address from latitude & longitude.
Geocode.fromLatLng("48.8583701", "2.2922926").then(
    (response) => {
      const address = response.results[0].formatted_address;
      console.log(address);
    },
    (error) => {
      console.error(error);
    }
  );
  
    useEffect(() => {
        console.log('user', user);
    }, [])
    return (
        <div className="MainDiv">
            {user.isLoggedIn ?
                <div className="UserDiv">
                    {user.userId == "60aa850939342b431c8932e5" ?
                        <Link className="editLink" to="/edit"><span><FontAwesomeIcon icon={faEdit} /></span><span> | דף עריכה</span></Link>
                        : null
                    }
                    <div className="Top"></div>
                    <div className="TopPage">
                        <img className="imgUser" src={user.picture} />
                        <h1>{user.fullName}</h1>
                    </div>
                    <div className="BottomPage">

                    </div>

                    <span className="logout" onClick={dispatchLogoutAction}><FontAwesomeIcon icon={faSignOutAlt} /> | התנתק</span>
                </div>
                :
                <div>
                    <Link to="/login"><span>התחבר</span></Link>
                </div>
            }

        </div>
    )
}


const mapStateToProps = (state) => ({
    user: state.user,
    navbar: state.navbar
});
const mapDispatchToProps = (dispatch) => ({
    dispatchLogoutAction: () => dispatch(logoutUser())
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User));
