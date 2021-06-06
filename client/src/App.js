import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import ResponsiveNavigation from './ResponsiveNavigation'
import Home from './pages/Home.jsx'
import Login from './login/Login';
import Register from './login/Register'
import Reset from './login/Reset'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import Spinner from './spinner/spinner';
import { ToastContainer, Slide } from 'react-toastify';
import { logoutUser, loading } from './redux/actions/authActionCreators';
import { changeLocation } from './redux/actions/locationAction';
import { SearchPage } from './pages/SearchPage';
import Edit from './pages/Edit';
import { changeNav } from './redux/actions/navbarAction';
import User from './pages/User';
import { getDistance } from 'geolib';
import Favorites from './pages/Favorites';
import FullDishCard from './Components/FullDishCard';
import Restaurant from './Components/Restaurant';


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

function App({ user, dispatchLogoutAction, dispatchNavbar, navbar, dispatchLoading, dispatchLocation, location }) {
  const apiUrl = '';
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [windowWidth, setwindowWidth] = useState(window.innerWidth)
  const [width, setWidth] = useState(0)
  const [navOpen, setNavOpen] = useState(true);
  const [myLat, setMyLat] = useState(null)
  const [myLng, setMyLng] = useState(null)
  const [dishes, setDishes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [allowGeoRecall, setallowGeoRecall] = useState(true)

  useEffect(() => {
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

  useEffect(() => {
    console.log("App.js Location=", location.data);
    if (location.data) {
      setMyLat(location.data.lat)
      setMyLng(location.data.lng)
    }

    if (dishes) {
      getAllDistances(dishes);
    }
  }, [location])

  const getDishes = () => {
    dispatchLoading();
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
          console.log('dishesAppJS', result);
          //setDishes(result);
          if (myLng !== null && myLat !== null) {
            dispatchLoading();
            getAllDistances(result);
          }
        },

        (error) => {
          console.log("err post=", error);
          dispatchLoading();
        }
      )
  }

  const getAllDistances = async (fullList) => {
    dispatchLoading();
    let temp = [];
    for (let i = 0; i < fullList.length; i++) {
      const element = fullList[i];
      let tempDish = element;
      await getDistanceFromPosition(element.Restaurant.location).then(res => {
        tempDish.Restaurant.distance = res.toFixed(2);
      });
      temp.push(tempDish);
    }
    setDishes(temp);
    dispatchLoading();
  }

  const getDistanceFromPosition = async (location) => {
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
    dispatchLoading();
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else {
      console.log("Error");
      dispatchLocation({
        lat: 32.79931431934253,
        lng: 34.98862649607837
      })
      setMyLat(32.444)
      setMyLng(35.666)
    }

  }


  const onSuccess = (position) => {
    setallowGeoRecall(false);
    console.log(position);
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    let loc = { lat, lng }
    dispatchLocation(loc)
    setMyLat(position.coords.latitude)
    setMyLng(position.coords.longitude)
    dispatchLoading();
  }
  const onError = (error) => {
    console.log(error);
    if (allowGeoRecall) {
      getLocation();
    }
    dispatchLoading();
  }

  const GetUserFavorites = () => {
    dispatchLoading();
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
          console.log('Favorites', result);
          setFavorites(result.Favorites);
          dispatchLoading();
        },

        (error) => {
          console.log("err post=", error);
          dispatchLoading();
        }
      )
  }



  const handleResize = (e) => {
    setWindowHeight(window.innerHeight);
    setwindowWidth(window.innerWidth);
  };

  const hadleNavOpen = (nav) => {
    dispatchNavbar(nav);
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
                <Route render={(props) => (<Restaurant dispatchLoading={dispatchLoading} user={user} {...props} />)} path="/restaurant" />
                <Route render={(props) => (<FullDishCard dispatchLoading={dispatchLoading} user={user} {...props} />)} path="/fulldishcard" />
                <Route render={(props) => (<Favorites dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} user={user} favorites={favorites} dishes={dishes} {...props} />)} path="/favorites" />
                <Route component={Login} exact path="/login" windowHeight={windowHeight} />
                <Route component={Register} path="/register" windowHeight={windowHeight} />
                <Route component={Reset} path="/reset" />
                <Route render={(props) => (<Home favorites={favorites} dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} user={user} dishes={dishes}{...props} />)} exact path="/" />
                <Route render={(props) => (<User myLat={myLat} myLng={myLng} {...props} />)} path="/user" />
                <Route render={(props) => (<SearchPage GetUserFavorites={GetUserFavorites} favorites={favorites} dispatchLoading={dispatchLoading} user={user} dishes={dishes} myLat={myLat} myLng={myLng} {...props} />)} path="/search" />
                <Redirect to="/login" />
              </Switch>
            )
            : (
              <Switch>
                                <Route render={(props) => (<Restaurant dispatchLoading={dispatchLoading} user={user} {...props} />)} path="/restaurant" />
                <Route render={(props) => (<FullDishCard dispatchLoading={dispatchLoading} user={user} {...props} />)} path="/fulldishcard" />
                <Route render={(props) => (<Home GetUserFavorites={GetUserFavorites} dispatchLoading={dispatchLoading} favorites={favorites} user={user} dishes={dishes}{...props} />)} exact path="/" />
                <Route render={(props) => (<User myLat={myLat} myLng={myLng} {...props} />)} path="/user" />
                <Route render={(props) => (<Favorites user={user} dishes={dishes} GetUserFavorites={GetUserFavorites} dispatchLoading={dispatchLoading} favorites={favorites} {...props} />)} path="/favorites" />
                <Route component={Edit} path="/edit" />
                <Route render={(props) => (<SearchPage GetUserFavorites={GetUserFavorites} favorites={favorites} dispatchLoading={dispatchLoading} user={user} dishes={dishes} myLat={myLat} myLng={myLng} {...props} />)} path="/search" />
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
                                <Route render={(props) => (<Restaurant dispatchLoading={dispatchLoading} user={user} {...props} />)} path="/restaurant" />
                <Route render={(props) => (<FullDishCard dispatchLoading={dispatchLoading} user={user} {...props} />)} path="/fulldishcard" />
                <Route component={Login} exact path="/login" windowHeight={windowHeight} />
                <Route component={Register} path="/register" windowHeight={windowHeight} />
                <Route component={Reset} path="/reset" />
                <Route render={(props) => (<Favorites user={user} dishes={dishes} dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} {...props} />)} path="/favorites" />
                <Route render={(props) => (<Home dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} user={user} dishes={dishes}{...props} />)} exact path="/" />
                <Route render={(props) => (<User myLat={myLat} myLng={myLng} {...props} />)} path="/user" />
                <Route render={(props) => (<SearchPage GetUserFavorites={GetUserFavorites} favorites={favorites} dispatchLoading={dispatchLoading} user={user} dishes={dishes} myLat={myLat} myLng={myLng} {...props} />)} path="/search" />
                <Redirect to="/login" />
              </Switch>
            ) :
            <Switch>
                              <Route render={(props) => (<Restaurant dispatchLoading={dispatchLoading} user={user} {...props} />)} path="/restaurant" />
              <Route render={(props) => (<FullDishCard dispatchLoading={dispatchLoading} user={user} {...props} />)} path="/fulldishcard" />
              <Route render={(props) => (<Home dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} user={user} dishes={dishes}{...props} />)} exact path="/" />
              <Route render={(props) => (<User myLat={myLat} myLng={myLng} {...props} />)} path="/user" />
              <Route render={(props) => (<Favorites user={user} dishes={dishes} dispatchLoading={dispatchLoading} GetUserFavorites={GetUserFavorites} favorites={favorites} {...props} />)} path="/favorites" />
              <Route render={(props) => (<SearchPage GetUserFavorites={GetUserFavorites} favorites={favorites} dispatchLoading={dispatchLoading} user={user} dishes={dishes} myLat={myLat} myLng={myLng} {...props} />)} path="/search" />
              <Route component={Edit} path="/edit" />
              {/* <Redirect to="/" /> */}
            </Switch>

        }
      </div>

    </div>
  )
}


const mapStateToProps = (state) => ({
  user: state.user,
  navbar: state.navbar,
  location: state.location
});
const mapDispatchToProps = (dispatch) => ({
  dispatchLoading: () => dispatch(loading()),
  dispatchLogoutAction: () => dispatch(logoutUser()),
  dispatchNavbar: (navOpen, onSuccess, onError) =>
    dispatch(changeNav(navOpen, onSuccess, onError)),
  dispatchLocation: (location, onSuccess, onError) =>
    dispatch(changeLocation(location, onSuccess, onError))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

//style={{ width: `${windowWidth - width}px` }}