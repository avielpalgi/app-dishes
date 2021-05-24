const mongoose = require('mongoose')


const reviewSChema = new mongoose.Schema({
    Rank:{
        type:Number,
        required:true
    },
    Comment:{
        type:String,
        required:false
    },
    Name:{
        type:String,
        required:false
    },
    CommentedAt: {
        type: Date,
        default: Date.now()
    },
    UserID:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    },
    DishId:{
        type:mongoose.Schema.Types.ObjectId,ref:'dish'
    }
})

 const Review = mongoose.model('review',reviewSChema);
 module.exports = Review;