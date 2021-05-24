const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Tags: [{
        type: String,
        required:false
    }],
    info:{
        type: String,
        required:false
    },
    Price: {
        type: Number,
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
    Reviews:[{
        type:mongoose.Schema.Types.ObjectId,ref:'review'
    }],
    Restaurant:{
        type:mongoose.Schema.Types.ObjectId,ref:'restaurant'
    },
    AvgRank:{
        type:Number
    }
});

 const Dish = mongoose.model('dish',dishSchema);
 module.exports = Dish;