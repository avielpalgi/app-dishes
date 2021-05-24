import React, { useState, useEffect, useCallback, useStyles } from 'react'
import "./dishcard.css";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

// app.js
//import 'shards-ui/dist/css/shards.min.css';

const DishCard = (props) => {
    const dish = props.dish;
    const apiUrl = 'http://localhost:4000';
    const [classFavor, setClassFavor] = useState("favor white")
    useEffect(() => {
        if (!props.favor) {
            setClassFavor("favor white")
        }
        else {
            setClassFavor("favor red")
        }
    }, [])

    useEffect(() => {
        if (!props.favor) {
            setClassFavor("favor white")
        }
        else {
            setClassFavor("favor red")
        }
    }, [props.favor])

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

    const addToFavorite = (dish) => {
        if (props.addToFavorite) {
            console.log("add dish",dish);
            props.addToFavorite(dish);
        }
        if (props.removeFromFavorite) {
            console.log("remove dish",dish);
            props.removeFromFavorite(dish);
        }
       
    }

    const removeFromFavorite = (dish) => {
        console.log('remove', dish);

    }


    return (
        <div className="card">
            <div className="card-header">
                <img className="card-img-top" src={dish.Images.Normal.url} alt={dish.Name} />
                <span className={classFavor} onClick={() => { addToFavorite(dish) }}><i class="fas fa-heart fa-inverse" data-fa-transform="shrink-8 fa-border"></i></span>
                <p className="dishName card-title">{dish.Name}</p>
            </div>
            <div class="card-body">
                <div className="divDetails">
                    <div className="row">
                        <div className="col-8 rightSide">
                            <p className="restType">סוג מנה: {dish.Type}</p>
                            <p className="restName">מסעדה: {dish.Restaurant.Name}</p>
                            <p className="restAddress">כתובת: {dish.Restaurant.Address}</p>
                            <Link to={{pathname:"/fulldishcard", state:{dish:dish}}}><p className="DishDetails">לחץ לפרטים נוספים</p></Link>
                        </div>
                        <div className="col-4 leftSide">
                            <p className="restDistance">{dish.Restaurant.distance} ק"מ ממך</p>
                            <div className="RankDiv" style={{ color: getColorForPercentage(dish.AvgRank / 5) }}>
                                <span className="rankIcon"><FontAwesomeIcon icon={faStar} /></span>
                                <span className="restRank">{dish.AvgRank}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DishCard
