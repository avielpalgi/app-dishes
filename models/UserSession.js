const mongoose = require('mongoose');

const UserSession = new mongoose.Schema({
    userId: {
        type:String,
        default: ''
    },
    date:{
        type:Date,
        default:Date.now()
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('UserSession', UserSession)