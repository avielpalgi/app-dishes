import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { logoutUser } from '../redux/actions/authActionCreators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faEdit,faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import './user.css';
import Geocode from "react-geocode";
import Map from './Map';
import {changeLocation} from '../redux/actions/locationAction'
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("");

// set response language. Defaults to english.
Geocode.setLanguage("he");
const User = ({ navbar, user, dispatchLogoutAction, myLng, myLat,dispatchLocation,location }) => {
    const [addressUser, setaddressUser] = useState(null)
    const [showMap, setshowMap] = useState(false)
    const [allowGeoRecall, setallowGeoRecall] = useState(true)
    // Get address from latitude & longitude.
    useEffect(() => {
        changeAddress();
    }, [])

    const changeAddress=()=>{
        Geocode.fromLatLng(location.data.lat, location.data.lng).then(
            (response) => {
                const address = response.results[0].formatted_address;
                setaddressUser(address);
            },
            (error) => {
                console.error("error", error);
            }
        );
    }

    useEffect(() => {
        changeAddress();

    }, [location])




    const getLocation = async () => {
        if (navigator.geolocation) {
            await navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
        else {
            console.log("Error");
            dispatchLocation({
                lat: 32.79931431934253,
                lng: 34.98862649607837
            })
            //   setMyLat(32.444)
            //   setMyLng(35.666)
        }

    }

    useEffect(() => {
    }, [location])


    const onSuccess = (position) => {
        setallowGeoRecall(false);
        console.log(position);
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let loc = { lat, lng }
        dispatchLocation(loc)
        //console.log("location",location);
        // setMyLat(position.coords.latitude)
        // setMyLng(position.coords.longitude)
        //dispatchLoading();
    }
    const onError = (error) => {
        console.log(error);
        if (allowGeoRecall) {
            getLocation();
        }
    }


    return (
        <div className="MainDiv">
            {user.isLoggedIn ?
                <div className="UserDiv">
                    {user.userId === "60aa850939342b431c8932e5" ?
                        <Link className="editLink" to="/edit"><span><FontAwesomeIcon icon={faEdit} /></span><span> | דף עריכה</span></Link>
                        : null
                    }
                    <div className="Top"></div>
                    <div className="TopPage">
                        <img className="imgUser" alt={user.fullName} src={user.picture} />
                        <h1>{user.fullName}</h1>
                    </div>
                    <div className="BottomPage">
                        <div className="address">
                            {addressUser ? <p>המיקום שלך: {addressUser}</p> : null}
                            <p onClick={()=>{getLocation()}}><FontAwesomeIcon icon={faLocationArrow} /> | איפוס מיקום</p>
                            <button onClick={() => { setshowMap(!showMap) }} className="btn btn-secondary">מעוניין לשנות מיקום?</button>
                            {
                                showMap ?
                                    <div className="showMap"><Map Mylat={myLat} Mylng={myLng} /></div>
                                    : null
                            }
                        </div>
                        <div className="contact">
                            <p>יש מנה שלא מופיע באפליקציה ואתה רוצה להמליץ עלייה? נתקלת בבעיה באפליקציה? סתם בא לך ליצור קשר? </p>
                            <button className="btn btn-secondary">צור קשר</button>
                        </div>
                        <span className="logout d-block d-sm-none" onClick={dispatchLogoutAction}><FontAwesomeIcon icon={faSignOutAlt} /> | התנתק</span>
                    </div>

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
    navbar: state.navbar,
    location: state.location
});
const mapDispatchToProps = (dispatch) => ({
    dispatchLogoutAction: () => dispatch(logoutUser()),
    dispatchLocation: (location, onSuccess, onError) =>
        dispatch(changeLocation(location, onSuccess, onError))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User));
