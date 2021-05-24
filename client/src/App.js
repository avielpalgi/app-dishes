import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Router } from '@reach/router'
import ResponsiveNavigation from './ResponsiveNavigation'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Login from './login/Login';
import Register from './login/Register'
import Reset from './login/Reset'
import Map from './pages/Map';
import UserRoute from './UserRoute';
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import Spinner from './spinner/spinner';
import { ToastContainer, Slide } from 'react-toastify';
import { logoutUser, loading } from './redux/actions/authActionCreators';
import { SearchPage } from './pages/SearchPage';
import { axios } from 'axios';
import Edit from './pages/Edit';
import { changeNav } from './redux/actions/navbarAction';
import User from './pages/User';
import { getDistance } from 'geolib';
import Favorites from './pages/Favorites';
import FullDishCard from './Components/FullDishCard';


const navLinks = [
  {
    text: 'ראשי',
    path: '/',
    icon: 'fa fa-home'
  },
  {
    text: 'חיפוש',
    path: '/search',
    icon: 'fa fa-search'
  },
  {
    text: 'המנות שלי',
    path: '/favorites',
    icon: 'fa fa-bookmark'
  },
  {
    text: 'החשבון שלי',
    path: '/user',
    icon: 'fa fa-user'
  },

]


function App({ user, dispatchLogoutAction, dispatchNavbar, navbar, dispatchLoading }) {
  const apiUrl = '';
  const [isLoading, setIsLoading] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [windowWidth, setwindowWidth] = useState(window.innerWidth)
  const [width, setWidth] = useState(0)
  const [navOpen, setNavOpen] = useState(true);
  const [myLat, setMyLat] = useState(null)
  const [myLng, setMyLng] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [dishes, setDishes] = useState([])
  const [favorites, setFavorites] = useState([])

const getData=()=>{
  fetch('/app/dish')
         .then((data) => data.text())
         .then((res) => console.log(res));
}
  useEffect(() => {
    getData();
    dispatchLoading();
    if (user.isLoggedIn) {
      GetUserFavorites();
    }
    getLocation();
    getDishes();
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getDishes();
  }, [myLng])

  const getDishes = () => {
    fetch('/app/dish', {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        'Accept': 'application/json'
      })
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          console.log('res', result);
          //setDishes(result);
          if (myLng !== null && myLat !== null) {
            getAllDistances(result);
          }
        },

        (error) => {
          console.log("err post=", error);
        }
      )
  }

  const getAllDistances = (fullList) => {
    let temp = [];
    for (let i = 0; i < fullList.length; i++) {
      const element = fullList[i];
      let tempDish = element;
      let c = getDistanceFromPosition(element.Restaurant.location).then(res => {
        tempDish.Restaurant.distance = res.toFixed(2);
      });
      temp.push(tempDish);
    }
    setDishes(temp);
  }

  const getDistanceFromPosition = async (location) => {
    dispatchLoading();
    let Temlocaiton = {
      latitude: location.lat,
      longitude: location.lng
    }
    var dis = getDistance(
      Temlocaiton,
      { latitude: myLat, longitude: myLng },
    );
    return dis / 1000
  }


  const getLocation = async () => {
    let latitude = "";
    let longitude = "";
    await navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      changePosition(latitude, longitude);
    });
  }
  const changePosition = async (latitude, longitude) => {
    setMyLat(latitude)
    setMyLng(longitude)
  }

  const GetUserFavorites = () => {
    console.log("here");
    fetch('/app/favorites/' + user.userId, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        'Accept': 'application/json'
      })
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          console.log('res', result);
          setFavorites(result.Favorites);
        },

        (error) => {
          console.log("err post=", error);
        }
      )
  }



  const handleResize = (e) => {
    setWindowHeight(window.innerHeight);
    setwindowWidth(window.innerWidth);
  };

  const hadleNavOpen = (nav) => {
    dispatchNavbar(nav);
    console.log("nav", nav);
    setNavOpen(nav);
    if (!nav) {
      setWidth(50)
    }
    else {
      setWidth(250);
    }
  }


  return (
    <div className="App">
      <Spinner />
      <ResponsiveNavigation
        navLinks={navLinks}
        logo={logo}
        background=" rgb(169 232 136)"
        hoverBackground="rgb(133 181 108)"
        linkColor="#fff"
        userName={user.fullName}
        isLoggedIn={user.isLoggedIn}
        onLogout={dispatchLogoutAction}
        navOpen2={false}
        hadleNavOpen={hadleNavOpen}
      />
      <div className="pagesPC d-none d-sm-block" style={{ height: `${windowHeight}px` }} >
        {
          !user.isLoggedIn ?
            (
              <Switch>
                <Route render={(props) => (<FullDishCard dispatchLoading={dispatchLoading}  user={user} {...props}  />)} path="/fulldishcard" />
                <Route render={(props) => (<Favorites dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} dishes={dishes} {...props} />)} path="/favorites" />
                <Route component={Login} exact path="/login" windowHeight={windowHeight} />
                <Route component={Register} path="/register" windowHeight={windowHeight} />
                <Route component={Reset} path="/reset" />
                <Route render={(props) => (<Home favorites={favorites} dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} user={user} dishes={dishes}{...props} />)} exact path="/" />
                <Route component={User} path="/user" />
                <Route component={Map} path="/map" />
                <Route render={(props) => (<SearchPage myLat={myLat} myLng={myLng} {...props} />)} path="/search" />
                <Redirect to="/login" />
              </Switch>
            )
            : (
              <Switch>
                <Route render={(props) => (<FullDishCard dispatchLoading={dispatchLoading} user={user} {...props}  />)} path="/fulldishcard" />
                <Route render={(props) => (<Home GetUserFavorites={GetUserFavorites} dispatchLoading={dispatchLoading} favorites={favorites} user={user} dishes={dishes}{...props} />)} exact path="/" />
                <Route component={User} path="/user" />
                <Route render={(props) => (<Favorites dishes={dishes} GetUserFavorites={GetUserFavorites} dispatchLoading={dispatchLoading} favorites={favorites} {...props} />)} path="/favorites" />
                <Route component={Map} path="/map" />
                <Route component={Edit} path="/edit" />
                <Route render={(props) => (<SearchPage myLat={myLat} myLng={myLng} {...props} />)} path="/search" />
                <Redirect to="/" />
              </Switch>
            )
        }
      </div>
      <div className="pages d-block d-sm-none" style={{ height: `${windowHeight}px` }} >
        {
          !user.isLoggedIn ?
            (
              <Switch>
                <Route render={(props) => (<FullDishCard dispatchLoading={dispatchLoading} user={user} {...props}  />)} path="/fulldishcard" />
                <Route component={Login} exact path="/login" windowHeight={windowHeight} />
                <Route component={Register} path="/register" windowHeight={windowHeight} />
                <Route component={Reset} path="/reset" />
                <Route render={(props) => (<Favorites dishes={dishes} dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} {...props} />)} path="/favorites" />
                <Route render={(props) => (<Home dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} user={user} dishes={dishes}{...props} />)} exact path="/" />
                <Route component={User} path="/user" />
                <Route component={Map} path="/map" />
                <Route render={(props) => (<SearchPage myLat={myLat} myLng={myLng} {...props} />)} path="/search" />
                <Redirect to="/login" />
              </Switch>
            ) :
            <Switch>
                <Route render={(props) => (<FullDishCard dispatchLoading={dispatchLoading} user={user} {...props}  />)} path="/fulldishcard" />
              <Route render={(props) => (<Home dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} user={user} dishes={dishes}{...props} />)} exact path="/" />
              <Route component={User} path="/user" />
              <Route component={Map} path="/map" />
              <Route render={(props) => (<Favorites dishes={dishes} dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} {...props} />)} path="/favorites" />
              <Route render={(props) => (<SearchPage myLat={myLat} myLng={myLng} {...props} />)} path="/search" />
              <Route component={Edit} path="/edit" />
              <Redirect to="/" />
            </Switch>

        }
      </div>

    </div>
  )
}


const mapStateToProps = (state) => ({
  user: state.user,
  navbar: state.navbar
});
const mapDispatchToProps = (dispatch) => ({
  dispatchLoading: () => dispatch(loading()),
  dispatchLogoutAction: () => dispatch(logoutUser()),
  dispatchNavbar: (navOpen, onSuccess, onError) =>
    dispatch(changeNav(navOpen, onSuccess, onError))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

//style={{ width: `${windowWidth - width}px` }}