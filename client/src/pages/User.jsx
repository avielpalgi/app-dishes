import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter,Link } from 'react-router-dom'
import { logoutUser } from '../redux/actions/authActionCreators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Edit from './Edit';
import './user.css';
const User = ({ navbar, user, dispatchLogoutAction }) => {
    const login=()=>{
        
    }
    return (
        <div className="MainDiv">
            <h1>שלום {user.fullName}</h1>
            {user.userId == "609fd83ce832f64914c7e1be" ? 
            <Link className="editLink" to="/edit">דף עריכה</Link>
            :null
            }
            {user.isLoggedIn ? <span className="logout" onClick={dispatchLogoutAction}><FontAwesomeIcon icon={faSignOutAlt} /> | התנתק</span> : <Link to="/login"><span>התחבר</span></Link>}
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
