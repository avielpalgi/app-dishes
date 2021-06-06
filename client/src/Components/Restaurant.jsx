import React, { useState, useEffect } from 'react'
import { faStar, faDirections, faMapMarkerAlt, faPhoneAlt, faLink, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import './Rest.css';
function Restaurant(props) {
    const [Rest, setRest] = useState(props.location.state.Rest)
    const [Menu, setMenu] = useState(props.location.state.Rest.Menu)

    const directToGoogleMap = (lat, lng, address,name) => {
        window.open("https://maps.google.com?q=" + name);

    }

    const MenuByRank = () => {
        let temp = Menu;
        console.log(Menu);
        temp.sort((a, b) => a.AvgRank - b.AvgRank).reverse();
        console.log('tempList', temp);
        setMenu([...temp]);
    }
    useEffect(() => {
        console.log(Rest);
        MenuByRank();
    }, [])


    var percentColors = [
        { pct: 0.5, color: { r: 0xff, g: 0x00, b: 0 } },
        { pct: 0.7, color: { r: 0xff, g: 0xff, b: 0 } },
        { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }];

    var getColorForPercentage = function (pct) {
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        var lower = percentColors[i - 1];
        var upper = percentColors[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        // or output as hex if preferred
    };
    return (
        <div className="MainDiv">
            <div className="header">
                {Rest.Images.Normal.url ? <img className="imageDish" src={Rest.Images.Normal.url} alt={Rest.Name} /> : null}
                <p className="dishName card-title">{Rest.Name}</p>
            </div>
            <div className="RestBodyCard">
                <div className="RestDetails row">
                    <div className="col-8 rightSide">
                        <p className="restType">סוג מסעדה: {Rest.Type}</p>
                        <p className="restAddress">כתובת: {Rest.Address}</p>
                        {Rest.Phone ? <p className="restAddress">טלפון: {Rest.Phone}</p> : null}
                    </div>
                    <div className="col-4 leftSide">
                        <p className="restDistance">{Rest.distance} ק"מ</p>
                        <div className="col links">
                            {Rest.Website ? <a className="diraction" href={Rest.Website} target="blank"><FontAwesomeIcon icon={faLink} /></a> : null}
                            {Rest.Phone ? <a href={"tel:" + Rest.Phone} className="diraction"><FontAwesomeIcon icon={faPhoneAlt} /></a> : null}
                            <span className="diraction"><FontAwesomeIcon onClick={() => { directToGoogleMap(Rest.location.lat, Rest.location.lng, Rest.Address,Rest.Name) }} icon={faMapMarkerAlt} /></span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-9 RestDishes">
                    <p>מנות לפי דירוג: </p>
                    <ul className="listDishInRest list-group">
                        {Menu.map((dish, key) =>
                            <li id={key}>
                                <div className="dishInRestDetails row">
                                    <div className="col-4 right">
                                        <img src={dish.Images.Normal.url ? dish.Images.Normal.url : `""`} alt={dish.Name} />
                                    </div>
                                    <div className="col-8 left">
                                        <Link to={{ pathname: "/fulldishcard", state: { dish: dish } }}><p className="DishName">{dish.Name}</p></Link>
                                        <div className="DetailsDivDish">
                                            <p className="restName">סוג: {dish.Type}</p>
                                            <p className="restName">מחיר: {dish.Price} ₪</p>
                                            <p className="restName" style={{ color: getColorForPercentage(parseFloat(dish.AvgRank).toFixed(1) / 5) }}>
                                                <span className=""><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="">{parseFloat(dish.AvgRank).toFixed(1)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default Restaurant
