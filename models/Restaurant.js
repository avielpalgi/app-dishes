const mongoose = require('mongoose');


const restaurantSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    City: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    Website: {
        type: String,
        required: false
    },
    Phone: {
        type: String,
        required: false
    },
    Address: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Images: {
        Small:{
            url:{type:String},
            width:{type:Number},
            height:{type:Number}
        },
        Normal:{ 
        url:{type:String},
        width:{type:Number},
        height:{type:Number}
    },
        Large:{ 
        url:{type:String},
        width:{type:Number},
        height:{type:Number}
    }
    },
    Menu: [{
        type:mongoose.Schema.Types.ObjectId,ref:'dish'
    }]

});

const Restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = Restaurant;