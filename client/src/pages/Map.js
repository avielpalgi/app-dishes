import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Circle, Marker } from '@react-google-maps/api';
import Slider from '@material-ui/core/Slider';
import list from '../Data.json';
import { Card } from 'react-bootstrap';
import { faTimes,faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Typography from '@material-ui/core/Typography';
import SearchBar from "material-ui-search-bar";
import { makeStyles } from '@material-ui/core/styles';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';
import {withRouter} from 'react-router-dom';
import './map.css';
import { connect } from 'react-redux'

const useStyles = makeStyles((theme) => ({



}));

function MapReact({navbar,user}) {
    const [navBar, setnavbar] = useState(navbar.data)
    const [selectedRest, setSelectedRest] = useState("")
    const classes = useStyles();
    const [listSearch, setListSearch] = useState([])
    const [search, setSearch] = useState("");
    const [lat, setlat] = useState(null)
    const [long, setlong] = useState(null)
    const [value, setvalue] = useState(0)
    const [value2, setvalue2] = useState(8000)
    const [zoom, setzoom] = useState(11)
    const [circle, setcircle] = useState(8000)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [windowWidth, setwindowWidth] = useState(window.innerWidth)
    const [markers, setMarkers] = useState([])
    const [arr, setArr] = useState([])
    const [fullList, setFullList] = useState(list.RestaurantsList)
    const [showRestBool, setShowRestBool] = useState(false)
    const [thisRest, setThisRest] = useState({ Address: null, Name: null, Menu: [] })
    const [res, setRes] = useState([])
    const [widthNav, setWidthNav] = useState(62);
    const onLoad = circle => {
        // console.log('Circle onLoad circle: ', circle)
    }

    useEffect(() => {
      console.log('navbar',navbar.data);
      if (navbar.data) {
        console.log('navbar',navbar.data);
          setWidthNav(265);
      }else{
        console.log('navbar',navbar.data);
        setWidthNav(65);
      }
    }, )

    const onUnmount = circle => {
        // console.log('Circle onUnmount circle: ', circle)
    }
    useEffect(() => {        
        let temp = [];
        fullList.map(rest => temp.push({ id: rest.Id, name: rest.Name }))
        setListSearch(temp)
        window.addEventListener("resize", handleResize,handleResizeWidth);
        OrderNewList();
        getLocation();
    }, []);


    const handleResize = (e) => {
        setWindowHeight(window.innerHeight);
    };

    const handleResizeWidth = (e) => {
        setwindowWidth(window.innerWidth);
    };


    const doSomethingWith = (value) => {
        console.log(value);
        setSearch(value);
    }

    const OrderNewList = () => {
        let menus = [];
        let markers = [];
        for (let i = 0; i < fullList.length; i++) {
            const element = fullList[i];
            let marker = {
                title: element.Name,
                description: element.Address,
                position: element.position,
                id: element.Id
            }
            markers.push(marker);
            if (element.Menu.length > 0) {
                element.Menu.map((item) => { menus.push(item) });
            }
        }
        setMarkers(markers);
        let num = 0;
        let sum = 0;
        for (let i = 0; i < menus.length; i++) {
            const element = menus[i];
            num = 0;
            sum = 0;
            for (let j = 0; j < element.Review.length; j++) {
                const rank = element.Review[j];
                num += rank.Rank;
            }
            sum = num / element.Review.length;
            element.AvgRank = sum;
        }
        setArr(menus);
    }

    const showMenu = (id) => {
        setShowRestBool(!showRestBool);
        for (let i = 0; i < fullList.length; i++) {
            const element = fullList[i];
            if (element.Id === id) {
                setThisRest(element);
                showRest(element);
            }
        }
    }

    const showRest = (rest) => {
        if (rest != "undefined") {
            return (
                <Card className="CardRest">
                    <i onClick={() => { setShowRestBool(!showRestBool) }}><FontAwesomeIcon icon={faTimes} /></i>
                    <Card.Body>
                        <Card.Title><h2>{thisRest.Name}</h2></Card.Title>
                        <Card.Text className="Menu">
                            {thisRest.Menu.length > 0 ? <ul>{thisRest.Menu.map(item => (<li key={item.Name}>{item.Name}, מחיר: {item.Price} ₪, דירוג: {item.AvgRank}</li>))}</ul> : ""}
                        </Card.Text>
                    </Card.Body>
                </Card>);
        }

    }

    //Google Map
    const getLocation = async () => {
        let latitude = "";
        let longitude = "";
        await navigator.geolocation.getCurrentPosition((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            changePosition(latitude, longitude);
        });
    }
    const changePosition = (latitude, longitude) => {
        setlat(latitude);
        setlong(longitude);
    }

    const valuetext = (value) => {
        return `${value} km`;
    }
    const handleChange = (event, newValue) => {
        setvalue(newValue);
        changeZoom();
    };
    const handleChange2 = (event, newValue) => {
        setvalue2(newValue);
        //this.changeCircle();
    };
    const changeCircle = () => {
        setcircle((value2 / 10) * 1000);
    }
    const changeZoom = () => {
        setzoom((value / 20) + 10)
    }

    const onOverMouse = (id) => {

    }

    const mapStyles = {
        width: '100%',
        height: `${windowHeight-50}px`,
    };
    const options = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: value2,
        zIndex: 1
    }

    const defaultCenter = {
        lat: lat, lng: long
    }
    const position = {
        lat: lat, lng: long

    }
    const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log(string, results)
        setRes(results);
    }

    const handleOnHover = (result) => {
        // the item hovered
        console.log(result)
        //setRes(result);
    }

    const handleOnSelect = (item) => {
        // the item selected
        console.log(item)
    }

    const handleOnFocus = () => {
        console.log('Focused')
    }

    useEffect(() => {
       if (selectedRest !== "") {
           console.log(selectedRest);
           showMenu(selectedRest.id)
       }
    }, [selectedRest])

    return (
        <div className="" >
            {lat ?
                <div>
                    <div className="mapclass">
                        <div className="search">
                            {/* <ReactSearchAutocomplete
                                items={listSearch}
                                onSearch={handleOnSearch}
                                onHover={handleOnHover}
                                onSelect={handleOnSelect}
                                onFocus={handleOnFocus}
                                autoFocus
                                styling={{ zIndex: 2 }} // To display it on top of the search box below
                            /> */}
                            <Autocomplete
                            popupIcon= {<FontAwesomeIcon icon={faSearch}/>}
                                id="combo-box-demo"
                                options={listSearch}
                                value=""
                                getOptionSelected={(e)=>setSelectedRest(e)}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                            />
                            {/* <div>
                        <ul>{res? res.map(rest=><li>{rest.name}</li>):null}</ul>
                        </div> */}
                        </div>


                        <LoadScript
                            //libraries= 'places'
                            googleMapsApiKey='AIzaSyDPyGwLnQ3lW6Le8phnQAsvbKED2vDsd0w'>
                            <GoogleMap
                                mapContainerStyle={mapStyles}
                                zoom={zoom}
                                center={defaultCenter}
                            >
                                <Marker
                                    position={position}
                                />
                                {markers.map(marker => (
                                    <Marker
                                        key={marker.id}
                                        onClick={() => { showMenu(marker.id) }}
                                        onMouseOver={() => { onOverMouse(marker.id) }}
                                        position={marker.position}
                                        title={marker.title}
                                    />
                                ))}
                                <Circle
                                    // optional
                                    onLoad={onLoad}
                                    // optional
                                    onUnmount={onUnmount}
                                    // required
                                    center={defaultCenter}
                                    // required
                                    options={options}
                                />
                            </GoogleMap>
                        </LoadScript>
                        <div>
                            {showRestBool ? showRest() : ""}
                        </div>
                        {/* <div className="rangeclass">
                            <Typography id="range-slider1" gutterBottom>
                                זום
                            </Typography>
                            <Slider
                                color="secondary"
                                value={value}
                                aria-labelledby="discrete-slider-custom"
                                onChange={handleChange}
                                aria-label="ddd"
                            />
                            <Typography id="range-slider2" gutterBottom>
                                רדיוס בק"מ
                            </Typography>
                            <Slider
                                getAriaValueText={valuetext}
                                //aria-valuetext={this.getLabel}
                                color="secondary"
                                value={value2}
                                aria-label="ddd"
                                aria-labelledby="discrete-slider-custom"
                                onChange={handleChange2}
                                valueLabelDisplay="on"
                                //getAriaLabel={this.getLabel}
                                min={1000}
                                max={20000}
                            />
                        </div> */}
                    </div>

                </div>
                : <p>error</p>}

        </div>

    )
}

const mapStateToProps = (state) => ({
    user: state.user,
    navbar: state.navbar
  });
export default withRouter(connect(mapStateToProps)(MapReact));
