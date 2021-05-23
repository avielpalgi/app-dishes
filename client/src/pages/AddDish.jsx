import React from 'react'

const AddDish = () => {
    return (
        <form>
            <div className="form-row">
                <div className="col-xs-12 form-group">
                    <label>שם מנה:</label>
                    <input className="form-control" type="text" />
                </div>
                <div className="col-xs-12 form-group">
                    <label>סוג מנה:</label>
                    <input className="form-control" type="text" />
                </div>
            </div>
            <div className="form-row">
                <div className="col-xs-12 form-group">
                    <label>תגיות:</label>
                    <input className="form-control" type="text" />
                </div>
                <div className="col-xs-12 form-group">
                    <label>מידע על המנה:</label>
                    <input className="form-control" type="text" />
                </div>
            </div>
            <div className="form-row">
                <div className="col-xs-12-md-4 form-group">
                    <label>מחיר:</label>
                    <input className="form-control" type="number" />
                </div>
                <div className="col-xs-12-md-8 form-group">
                    <label>תמונות:</label>
                    <input className="form-control" type="text" />
                </div>
            </div>
            <button type="submit" className="btn btn-primary">Add</button>
        </form>
    )
}

export default AddDish
