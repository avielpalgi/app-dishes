import React, { useState, useEffect, useCallback } from 'react'
import "./home.css";
import DishCard from '../Components/DishCard';

function Home(props) {
    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const apiUrl = 'http://localhost:4000';
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [dishes, setDishes] = useState([]);
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

    const addToFavorite = (dish) => {
        props.dispatchLoading();
        console.log("HomePage", dish);
        console.log('userId', props.user.userId);
        if (props.user.userId) {
            fetch('/app/favorites/' + props.user.userId, {
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
                    },

                    (error) => {
                        props.dispatchLoading();
                        console.log("err post=", error);
                    }
                )
        }
        else {
            props.dispatchLoading();
            console.log("אתה צריך להירשם");
        }

    }

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
                        props.dispatchLoading();
                        console.log("err post=", error);
                    }
                )
        }
        else {
            props.dispatchLoading();
            console.log("אתה צריך להירשם");
        }
    }

    return (
        <div className="MainDiv" >
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
                <div className="listDishes row">
                    {dishes.map((dish, key) =>
                        props.favorites.some(f => f.Name === dish.Name) ?
                            <DishCard removeFromFavorite={removeFromFavorite} favor={true} dish={dish} /> : <DishCard addToFavorite={addToFavorite} favor={false} dish={dish} />
                    )}
                </div>
                : null}

        </div>
    )
}

export default Home
