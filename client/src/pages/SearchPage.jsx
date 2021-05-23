import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './search.css';
import 'react-dropdown-now/style.css';
import { Dropdown, Selection } from 'react-dropdown-now';
import { Multiselect } from "multiselect-react-dropdown";
import { ListGroup, Accordion, Card, Button } from 'react-bootstrap';
import {getDistance} from 'geolib';



import list from '../data2.json';
const objectArray = [
    { key: "חיפה והקריות", area: "צפון" },
    { key: "הגליל העליון והמערבי", area: "צפון" },
    { key: "הגליל התחתון והעמקים", area: "צפון" },
    { key: "רמת הגולן", area: "צפון" },
    { key: "השרון", area: "מרכז" },
    { key: "מרכז הארץ", area: "מרכז" },
    { key: "השומרון", area: "מרכז" },
    { key: "ים המלח ומדבר יהודה", area: "מרכז" },
    { key: "צפון הנגב", area: "דרום" },
    { key: "מרכז הנגב והמכתשים", area: "דרום" },
    { key: "אילת והערבה", area: "דרום" },
];
const typesArray = [
    { key: "שווארמה", type: "בשרי" },
    { key: "איטלקית", type: "חלבי" },
    { key: "בשר", type: "בשרי" },
]
export const SearchPage = (props) => {
    const [fullList, setFullList] = useState(list)
    const [cities, setcities] = useState([])
    const [types, setTypes] = useState([])
    const [chooseList, setchooseList] = useState([])
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [newList, setNewList] = useState([])
    const [width, setWidth] = useState(120)
    const [myLocation, setmyLocation] = useState({ lat: props.myLat, lng: props.myLng })

    useEffect(() => {
        getAllDistances();
        window.addEventListener("resize", handleResize);
    }, []);

    const getDistanceFromPosition = (location) => {
        console.log(location);
                let Temlocaiton = {
                    latitude:location.lat,
                    longitude:location.lng
                }
                var dis = getDistance(
                    Temlocaiton,
                    {latitude: myLocation.lat, longitude: myLocation.lng},
                  );
                  return dis/1000
    }

    const getAllDistances = ()=>{
        let temp = [];
        for (let i = 0; i < fullList.length; i++) {
            const element = fullList[i];
            temp.push(
                {
                distance:getDistanceFromPosition(element.location),
                restaurant:element
            });
        }
        console.log(temp);
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
            fullList.map(rest => e.map(city => rest.area == city.key ? l.push(rest) : null));
            if (types.length > 0) {
                l.map(rest => types.map(type => (rest.Type == type.key) ? l2.push(rest) : null));
            }
            else {
                l.map(rest => l2.push(rest));
            }
        }
        else {
            if (types.length > 0) {
                fullList.map(rest => types.map(type => (rest.Type == type.key) ? l2.push(rest) : null))
            }
        }
        setNewList(l2);
    }

    const checkifExistType = (e) => {
        let l = [];
        let l2 = [];
        if (e.length > 0) {
            fullList.map(rest => e.map(type => rest.Type == type.key ? l.push(rest) : null));
            if (cities.length > 0) {
                l.map(rest => cities.map(city => rest.area == city.key ? l2.push(rest) : null));
            }
            else {
                l.map(rest => l2.push(rest));
            }
        }
        else {
            if (cities.length) {
                fullList.map(rest => cities.map(city => (rest.area == city.key) ? l2.push(rest) : null))
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

    const CalculateAVGRank = (listRanks) => {
        let sum = 0;
        listRanks.map(r => (sum += r.Rank));
        let avg = sum / listRanks.length;
        return avg;
    }


    const renderList = () => {
        return (
            <div>
                <Accordion className="ListRest" defaultActiveKey="0">
                    {newList.map(rest =>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle className="restDetails" as={Button} variant="link" eventKey={rest.Id}>
                                    {rest.Name} - {rest.Address}
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={rest.Id}>
                                <Card.Body>
                                    <ul className="listFood">
                                        {rest.Menu ?
                                            rest.Menu.map(food => <li>
                                                <h5>{food.Name}</h5>
                                                <p>מחיר: ₪{food.Price}</p>
                                                {food.info ? <p>מה במנה: {food.info}</p> : null}
                                                {food.Review ? <p>דירוג: {CalculateAVGRank(food.Review)}</p> : null}
                                            </li>)
                                            : null}
                                    </ul>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    )}
                </Accordion>
            </div>
        )
    }
    return (
        <div className="SearchDiv" >
            <h1>חיפוש מסעדה / מנה</h1>
            <div className="selects">
                <Multiselect
                    selectedValues={cities} // Preselected value to persist in dropdown
                    onSelect={onSelect} // Function will trigger on select event
                    onRemove={onRemove} // Function will trigger on remove event
                    options={objectArray}
                    groupBy="area"
                    displayValue="key"
                    showCheckbox={true}
                    placeholder="בחר איזור"
                />
                <Multiselect
                    selectedValues={types} // Preselected value to persist in dropdown
                    onSelect={onSelectType} // Function will trigger on select event
                    onRemove={onRemoveType} // Function will trigger on remove event
                    options={typesArray}
                    groupBy="type"
                    displayValue="key"
                    showCheckbox={true}
                    placeholder="סוג אוכל"
                />
            </div>
            <div>
                {newList ? renderList() : null}
            </div>

        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)
