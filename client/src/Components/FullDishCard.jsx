import React, { useState, useEffect, useCallback, useStyles } from 'react'
import { faStar, faDirections, faMapMarkerAlt, faPhoneAlt, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './fullcard.css';
import Rating from 'react-rating'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)

const FullDishCard = (props) => {
    const [dish, setDish] = useState(props.location.state.dish)
    const [reviews, setReviews] = useState(props.location.state.dish.Reviews)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [name, setName] = useState("")
    const [reviewOpen, setReviewOpen] = useState(false)
    useEffect(() => {
        console.log(reviews);
        // if (props.location.state) {
        //     setDish(props.location.state.dish)
        // }
    }, [])

    const saveReview = () => {
        props.dispatchLoading();
        console.log("name", name);
        console.log("comment", comment);
        console.log("rating", rating);
        console.log("user", props.user.userId);
        const Review = {
            Name: name,
            Rank: rating,
            Comment: comment,
            UserID: props.user.userId,
        }
        console.log(Review);
        console.log(dish._id);
        if (props.user.userId) {
            fetch('/app/dish/' + dish._id + '/reviews', {
                method: "POST",
                body: JSON.stringify(Review),
                headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                })
            })
                .then((res) => {
                    return res.json();
                })
                .then(
                    (result) => {
                        console.log('resReview', result);
                        // setReviews(result)
                        setTimeout(() => {
                            props.dispatchLoading();
                        }, 800);
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

    const directToGoogleMap = () => {

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
    return (
        <div className="MainDiv">
            <div className="header">
                <img className="imageDish" src={dish.Images.Normal.url} alt={dish.Name} />
                <p className="dishName card-title">{dish.Name}</p>
            </div>
            <div class="bodyCard">
                <div className="divDetails">
                    <div className="row">
                        <div className="col-8 rightSide">
                            <p className="restType">סוג מנה: {dish.Type}</p>
                            <p className="restName">מסעדה: {dish.Restaurant.Name}</p>
                            <p className="restName">מחיר: {dish.Price} ₪</p>
                            <p className="restAddress">כתובת: {dish.Restaurant.Address}</p>
                            {dish.Restaurant.Phone ? <p className="restAddress">טלפון: {dish.Restaurant.Phone}</p> : null}
                        </div>
                        <div className="col-4 leftSide">
                            <p className="restDistance">{dish.Restaurant.distance} ק"מ</p>
                            <div className="RankDiv" style={{ color: getColorForPercentage(parseFloat(dish.AvgRank).toFixed(1) / 5) }}>
                                <span className="rankIcon"><FontAwesomeIcon icon={faStar} /></span>
                                <span className="restRank">{parseFloat(dish.AvgRank).toFixed(1)}</span>
                            </div>
                            <div className="col links">
                                <button className="diraction btn btn-primary"><FontAwesomeIcon icon={faLink} /></button>
                                <button className="diraction btn btn-primary"><FontAwesomeIcon icon={faPhoneAlt} /></button>
                                <button className="diraction btn btn-primary" onClick={() => { directToGoogleMap() }}><FontAwesomeIcon icon={faMapMarkerAlt} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="title"><h2>ביקורות: </h2></div>
                    <ul className="list-group listRev">
                        {reviews ? reviews.map((rev, key) =>
                            <li id={key} className="list-group-item">
                                <div className="row">
                                    <div className="col-2 picDivRev">
<<<<<<< HEAD
                                        {rev.UserID ? rev.UserID.Picture ? <div><img src={rev.UserID.Picture} /></div> : <div id="profileImage">{rev.UserID.FirstName.charAt(0) + rev.UserID.LastName.charAt(0)}</div> : null}
                                    </div>
                                    <div className="col-10 detailsRev">
                                        <div className="NameRev">{rev.Name ? <p>{rev.Name}</p> : <p>אנונימי</p>}</div>
=======
                                        {rev.UserID ? rev.UserID.Picture ? <div><img className="ProfileImageIMG" src={rev.UserID.Picture} /></div> : <div id="profileImage">{rev.UserID.FirstName.charAt(0) + rev.UserID.LastName.charAt(0)}</div> : null}
                                    </div>
                                    <div className="col-10 detailsRev">
                                        <div className="NameRev">{rev.Name ? <span>{rev.Name}</span> : <span>אנונימי</span>}</div>
>>>>>>> masterbranch
                                        <div className="DateAndRank">
                                            <span>
                                            <Rating style={{ color: getColorForPercentage(rev.Rank / 5) }} emptySymbol={<FontAwesomeIcon icon={["far", "star"]} />} fullSymbol={<FontAwesomeIcon icon={["fa", "star"]} />} {...props} initialRating={rev.Rank} fractions={2} />
                                            </span>
                                            <span>
                                            <ReactTimeAgo className="dateRev" date={rev.CommentedAt} locale="en-US" />
                                            </span>
                                                
                                        </div>


                                        <p>{rev.Comment}</p>
                                    </div>
                                </div>

                            </li>
                        ) : null}
                    </ul>
                    <div className="addRev">
                        <button onClick={() => { setReviewOpen(!reviewOpen) }} className="btn btn-primary">הוסף ביקורת</button>
                        {reviewOpen ?
                            <div>
                                <span>דרג: </span><Rating onChange={(e) => setRating(e)} emptySymbol={<FontAwesomeIcon icon={["far", "star"]} />}
                                    fullSymbol={<FontAwesomeIcon icon={["fa", "star"]} />} {...props} initialRating={rating} fractions={2}
                                />
                                <div className="col-xs-12 form-group nameInput">
                                    <label>שם:(לא חובה)</label>
                                    <input placeholder={props.user ? props.user.fullName : null} value={name} onChange={(e) => setName(e.target.value)} className="form-control" type="text" />
                                </div>
                                <div className="col-xs-12 form-group">
                                    <label>הערה:</label>
                                    <textarea class="form-control commentInput" value={comment} onChange={(e) => setComment(e.target.value)} id="exampleFormControlTextarea1" rows="2"></textarea>
                                </div>
                                <button onClick={() => { saveReview() }} className="btn btn-primary">שמור</button>
                            </div>
                            : null}

                    </div>
                </div>
            </div>

        </div>
    )
}

export default FullDishCard
