import React, { useState, useEffect } from 'react'
const AddRestaurant = () => {
    const [Name, setName] = useState("")
    const [Type, setType] = useState("")
    const [area, setArea] = useState("")
    const [City, setCity] = useState("")
    const [Website, setWebsite] = useState("")
    const [Phone, setPhone] = useState("")
    const [Address, setAddress] = useState("")
    const [location, setLocation] = useState({ lat: "", lng: "" })
    const apiUrl = 'https://my-app-dishes.herokuapp.com';


    const handleOnSubmit = (event) => {
        event.preventDefault();
        const rest = {
            Name: Name,
            Type: Type,
            area: area,
            City: City,
            Website: Website,
            Phone: Phone,
            Address: Address,
            location: location
        }
        console.log(rest);
        fetch(apiUrl + '/app/restaurant', {
            method: "POST",
            body: JSON.stringify(rest),
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
                    ClearForm();
                },

                (error) => {
                    console.log("err post=", error);
                }
            )
    }

    const ClearForm = () => {
        setAddress("");
        setArea("");
        setCity("");
        setName("");
        setLocation({ lat: "", lng: "" });
        setPhone("");
        setType("");
        setWebsite("");
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <div className="form-row">
                <div className="col-xs-12 form-group">
                    <label>שם מסעדה:</label>
                    <input value={Name} onChange={(e) => setName(e.target.value)} className="form-control" type="text" />
                </div>
                <div className="col-xs-12 form-group">
                    <label>סוג מסעדה:</label>
                    <input value={Type} onChange={(e) => setType(e.target.value)} className="form-control" type="text" />
                </div>
            </div>
            <div className="form-row">
                <div className="col-xs-12 form-group">
                    <label>איזור בארץ:</label>
                    <input value={area} onChange={(e) => setArea(e.target.value)} className="form-control" type="text" />
                </div>
                <div className="col-xs-12 form-group">
                    <label>עיר:</label>
                    <input value={City} onChange={(e) => setCity(e.target.value)} className="form-control" type="text" />
                </div>
            </div>
            <div className="form-row">
                <div className="col-xs-12-md-8 form-group">
                    <label>אתר אינטרנט:</label>
                    <input value={Website} onChange={(e) => setWebsite(e.target.value)} className="form-control" type="text" />
                </div>
                <div className="col-xs-12-md-4 form-group">
                    <label>טלפון:</label>
                    <input value={Phone} onChange={(e) => setPhone(e.target.value)} className="form-control" type="text" />
                </div>
            </div>
            <div className="form-row">
                <div className="col-xs-12 col-md-6 form-group">
                    <label>כתובת:</label>
                    <input value={Address} onChange={(e) => setAddress(e.target.value)} className="form-control" type="text" />
                </div>
                <div className="col-xs-12 form-group">
                    <label>נ"צ: </label>
                </div>
                <div className="col form-group">
                    <label>lat:</label>
                    <input value={location.lat} onChange={(e) => setLocation({ lat: e.target.value, lng: location.lng })} step="any" className="form-control" type="number" />
                </div>
                <div className="col form-group">
                    <label>lng:</label>
                    <input value={location.lng} onChange={(e) => setLocation({ lng: e.target.value, lat: location.lat })} step="any" className="form-control" type="number" />
                </div>
            </div>
            <button type="submit" className="btn btn-primary">Add</button>
        </form>
    )
}

export default AddRestaurant
