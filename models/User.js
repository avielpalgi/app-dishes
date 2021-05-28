const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [emailValidator, 'incorrect mail format']
    },
    Password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    Picture:{
        type:String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    Picture:{
        type:String
    },
    Favorites:[{
        type:mongoose.Schema.Types.ObjectId,ref:'dish'
    }]

});
User.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};


function emailValidator(value) {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(value)
}

User.pre('save',async function(next){
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.Password, 10)
        this.Password = passwordHash;
        next();
    } catch (error) {
        next(error)
    }
});

User.methods.validPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.Password);
    } catch (error) {
        throw new Error(error)
    } 
}


module.exports = mongoose.model('user', User)