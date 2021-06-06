import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import 'react-dropdown-now/style.css';
import { Multiselect } from "multiselect-react-dropdown";
import DishCard from '../Components/DishCard';
import './search.css';
import "./home.css";
import Typography from '@material-ui/core/Typography';
import SearchBar from "material-ui-search-bar";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';
import { faTimes,faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const objectArray = [
//     { key: "חיפה והקריות", area: "צפון" },
//     { key: "הגליל העליון והמערבי", area: "צפון" },
//     { key: "הגליל התחתון והעמקים", area: "צפון" },
//     { key: "רמת הגולן", area: "צפון" },
//     { key: "השרון", area: "מרכז" },
//     { key: "מרכז הארץ", area: "מרכז" },
//     { key: "השומרון", area: "מרכז" },
//     { key: "ים המלח ומדבר יהודה", area: "מרכז" },
//     { key: "צפון הנגב", area: "דרום" },
//     { key: "מרכז הנגב והמכתשים", area: "דרום" },
//     { key: "אילת והערבה", area: "דרום" },
// ];
// const typesArray = [
//     { key: "שווארמה", type: "בשרי" },
//     { key: "איטלקית", type: "חלבי" },
//     { key: "בשר", type: "בשרי" },
// ]
export const SearchPage = (props) => {
    const [fullList, setFullList] = useState([])
    const [cities, setcities] = useState([])
    const [types, setTypes] = useState([])
    const [typesBeforeSelect, settypesBeforeSelect] = useState([])
    const [CitiesBeforeSelect, setCitiesBeforeSelect] = useState([])
    const [AreaBeforeSelect, setAreaBeforeSelect] = useState([])
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [newList, setNewList] = useState([])
    const [dishes, setDishes] = useState([]);
    const [favorites, setFavorites] = useState([])
    const [selectedDish, setselectedDish] = useState("")
    const [res, setRes] = useState([])
    const [ListSearch, setListSearch] = useState([])
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        getDetails();
        setFavorites(props.favorites)
        setDishes(props.dishes)
        setFullList(props.dishes)
        let temp = [];
        props.dishes.map(rest => temp.push({ id: rest._id, name: rest.Name }))
        setListSearch(temp)
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
        setFullList(props.dishes)
    }, [props.dishes])

    useEffect(async () => {
        console.log("dishes", dishes);
    }, [dishes])

    const sortByRank = async () => {
        let tempList = newList;
        tempList.sort((a, b) => a.AvgRank - b.AvgRank).reverse();
        setNewList([...tempList]);
    }

    const sortByDistance = async () => {
        let tempList = newList;
        tempList.sort((a, b) => a.Restaurant.distance - b.Restaurant.distance)
        setNewList([...tempList]);
    }

    const getDetails = () => {
        fetch('/app/search', {
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
                    settypesBeforeSelect(result.Types)
                    setAreaBeforeSelect(result.Areas)
                },
                (error) => {
                    console.log("err post=", error);
                }
            )
    }
   
    const handleResize = (e) => {
        setWindowHeight(window.innerHeight);
    };

    const onSelect = (e) => {
        setcities(e);
        checkifExistCity(e);
    }

    const onRemove = (e) => {
        setcities(e);
        checkifExistCity(e);
    }

    const onSelectType = (e) => {
        setTypes(e);
        checkifExistType(e);
    }

    const onRemoveType = (e) => {
        setTypes(e);
        checkifExistType(e);
    }

    const checkifExistCity = (e) => {
        let l = [];
        let l2 = [];
        if (e.length > 0) {
            fullList.map(dish => e.map(city => dish.Restaurant.area === city.key ? l.push(dish) : null));
            if (types.length > 0) {
                l.map(rest => types.map(type => (rest.Type === type.key) ? l2.push(rest) : null));
            }
            else {
                l.map(rest => l2.push(rest));
            }
        }
        else {
            if (types.length > 0) {
                fullList.map(rest => types.map(type => (rest.Type === type.key) ? l2.push(rest) : null))
            }
        }
        setNewList(l2);
    }

    const checkifExistType = (e) => {
        let l = [];
        let l2 = [];
        if (e.length > 0) {
            fullList.map(rest => e.map(type => rest.Type === type.key ? l.push(rest) : null));
            if (cities.length > 0) {
                l.map(dish => cities.map(city => dish.Restaurant.area === city.key ? l2.push(dish) : null));
            }
            else {
                l.map(rest => l2.push(rest));
            }
        }
        else {
            if (cities.length) {
                fullList.map(dish => cities.map(city => (dish.Restaurant.area === city.key) ? l2.push(dish) : null))
            }
        }
        setNewList(l2);
    }

    useEffect(() => {
        console.log("newList", newList);
    }, [newList])

    useEffect(() => {
        checkifExistCity(cities);
    }, [cities])
    useEffect(() => {
        checkifExistType(types);
    }, [types])

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

    
    const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log(string, results)
        console.log(ListSearch);
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
        for (let j = 0; j < props.dishes.length; j++) {
            const element = props.dishes[j];
            if (element._id == item.id) {
                let temp = [];
                temp.push(element)
                setNewList(temp);
                setRes([]);
            }
        }
    }

    const handleOnFocus = () => {
        console.log('Focused')
    }



    return (
        <div className="MainDiv">
            <h4>חיפוש מנה: </h4>
            <div className="searchDiv">
                            <ReactSearchAutocomplete
                                items={ListSearch}
                                onSearch={handleOnSearch}
                                onHover={handleOnHover}
                                onSelect={handleOnSelect}
                                onFocus={handleOnFocus}
                                autoFocus
                                styling={{ zIndex: 2 }} // To display it on top of the search box below
                            />
                          
                              <div>
                        <ul>{res? res.map(rest=><li>{rest.Name}</li>):null}</ul>
                        </div>
                           
                        </div>
                <div className="chooseOrder">
                <Multiselect
                    selectedValues={cities} // Preselected value to persist in dropdown
                    onSelect={onSelect} // Function will trigger on select event
                    onRemove={onRemove} // Function will trigger on remove event
                    options={AreaBeforeSelect}
                    //groupBy="area"
                    displayValue="key"
                    showCheckbox={true}
                    placeholder="בחר איזור"
                />
                <Multiselect
                    selectedValues={types} // Preselected value to persist in dropdown
                    onSelect={onSelectType} // Function will trigger on select event
                    onRemove={onRemoveType} // Function will trigger on remove event
                    options={typesBeforeSelect}
                    // groupBy="type"
                    displayValue="key"
                    showCheckbox={true}
                    placeholder="סוג אוכל"
                />
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
            {newList.length > 0 ?
                <div className="listDishes row">
                    {newList.map((dish, key) =>
                        props.favorites.some(f => f.Name === dish.Name) ?
                            <DishCard removeFromFavorite={removeFromFavorite} favor={true} dish={dish} /> : <DishCard addToFavorite={addToFavorite} favor={false} dish={dish} />
                    )}
                </div>
                : null}
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)


/* 

*/
