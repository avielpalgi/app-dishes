import React, { useState, useEffect } from 'react'
import "./Edit.css";
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import AddRestaurant from './AddRestaurant';
import AddDish from './AddDish';

function Edit() {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [options, setOptions] = useState([{ label: "סוג עריכה", value: "" }, { label: "הוספת מסעדה", value: "הוספת מסעדה" }, { label: "הוספת מנה", value: "הוספת מנה" }])
    const [selected, setSelected] = useState({ label: "סוג עריכה", value: "" })
    useEffect(() => {
        window.addEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        console.log(selected);
        EditRender();

    }, [selected])


    const EditRender = () => {
        switch (selected.value) {
            case "הוספת מסעדה":
                return <AddRestaurant />;
            case "הוספת מנה":
                return <AddDish />
        }

    }

    const handleResize = (e) => {
        setWindowHeight(window.innerHeight);
    };
    return (
        <div className="MainDiv" style={{ height: `${windowHeight - 60}px` }}>
            <h1>דף עריכה</h1>
            <div className="editDropClass">
                <span>בחר סוג עריכה: </span>
                <Dropdown
                    placeholder={options[0].label}
                    className="DropDownClass"
                    options={options}
                    onChange={(e) => setSelected(e)}
                    onSelect={(e) => setSelected(e)} // always fires once a selection happens even if there is no change
                />
            </div>

            <div>
                <h3>{selected.label}</h3>
                <div>
                    {EditRender()}
                </div>
            </div>

        </div>
    )
}

export default Edit
