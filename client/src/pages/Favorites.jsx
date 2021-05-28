import React, { useState, useEffect, useCallback } from 'react'
import "./home.css";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DishCard from '../Components/DishCard';

const Favorites = (props) => {
    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const apiUrl = 'http://localhost:4000';
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [dishes, setDishes] = useState([]);
    const [classFavorite, setclassFavorite] = useState("favor")
    const [ifFavor, setIfFavor] = useState(false)
    const [favorites, setFavorites] = useState([])
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        setFavorites(props.favorites)
        setDishes(props.dishes)
    }, []);

    useEffect(() => {
        console.log(favorites);
        setDishes([...dishes]);
    }, [favorites])

    useEffect(() => {
        setFavorites(props.favorites)
    }, [props.favorites])

    useEffect(() => {
        setDishes(props.dishes);
    }, [props.dishes])

    useEffect(async () => {
        console.log("dishes", dishes);
    }, [dishes])

    const handleResize = (e) => {
        setWindowHeight(window.innerHeight);
    };

    const sortByRank = async () => {
        let tempList = dishes;
        tempList.sort((a, b) => a.AvgRank - b.AvgRank).reverse();
        console.log('tempList', tempList);
        setDishes([...tempList]);
        console.log("state", dishes);
    }

    const sortByDistance = async () => {
        let tempList = dishes;
        tempList.sort((a, b) => a.Restaurant.distance - b.Restaurant.distance)
        console.log('tempList', tempList);
        setDishes([...tempList]);
        console.log("state", dishes);
    }

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

    
const removeFromFavorite = (dish) => {
    
    props.dispatchLoading();
    console.log("HomePage remove", dish);
    if (props.user.userId) {
        fetch('/app/favorites/' + props.user.userId + '/del', {
            method: "POST",
            body: JSON.stringify(dish),
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            })
        })
            .then((res) => {
                return res.json();
            })
            .then(
                (result) => {
                    console.log('res', result);
                    props.GetUserFavorites();
                    setTimeout(() => {
                        props.dispatchLoading();
                    }, 800);
                    // setFavorites(result.Favorites);
                },

                (error) => {
                    console.log("err post=", error);
                }
            )
    }
    else {
        console.log("אתה צריך להירשם");
    }
}

    return (
        <div>
            <h2>רשימת המנות שלי: </h2>
            <div className="MainDiv" >
            <h1>דף ראשי</h1>
            <div className="chooseOrder">
                <p>סדר לפי: </p>
                <div className="row">
                    <div className="col-6 ButtonClass">
                        <button className="btn btn-secondary" onClick={() => { sortByDistance() }}>קרוב אליי</button>

                    </div>
                    <div className="col-6 ButtonClass">
                        <button className="btn btn-secondary" onClick={() => { sortByRank() }}>דירוג</button>
                    </div>
                </div>
            </div>
            {dishes.length > 0 ?
                <div className="listDishes">
                    {dishes.map((dish, key) =>
                        props.favorites.some(f => f.Name === dish.Name) ?
                            <DishCard removeFromFavorite={removeFromFavorite} favor={true} dish={dish} /> : null
                    )}
                </div>
                : null}

        </div>
        </div>
    )
}

export default Favorites
