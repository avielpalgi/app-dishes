const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { findByIdAndUpdate } = require('../models/User');
exports.register = async (req, res, next) => {
    const { FirstName, LastName, Email, Password } = req.body
    const user = await User.findOne({ Email });
    if (user) {
        return res.status(403).json({ error: { message: 'Email already in use' } })
    }
    const newUser = new User({ FirstName, LastName, Email, Password });
    try {
        await newUser.save();
        const token = getSignedToken(newUser);
        res.status(200).json({ token });
    } catch (error) {
        error.status = 400;
        next(error);
    }

}

exports.login = async (req, res, next) => {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email })
    if (!user)
        return res.status(403).json({ error: { message: 'invalid email/password' } })
    const isValid = await user.validPassword(Password);
    if (!isValid)
        return res.status(403).json({ error: { message: 'invalid email/password' } })
    const token = getSignedToken(user);
    res.status(200).json({ token });
};

exports.AddtoFavorite = async (req, res, next) => {
    const userId = req.params.userId;
    const dish = req.body;
    const user = await User.findById(userId);
    try {
        if (user) {
            user.Favorites.push(dish);
            await user.save();
            res.status(200).json(user);
        }
    } catch (error) {
        error.status = 400;
        next(error);
    }
}

exports.GetUserFavorites = async (req, res, next) => {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('Favorites');
    try {
        if (user) {
            res.status(200).json(user);
        }
    } catch (error) {
        error.status = 400;
        next(error);
    }

}

exports.DeleteFavorite = async(req,res,next) =>{
    const userId = req.params.userId;
    const dish = req.body;
    const user = await User.findById(userId).populate('Favorites');
    
    try {
        if (user) {
            await user.updateOne({$pull:{"Favorites":dish._id}});
            await user.save();
            res.status(200).json(user);
        }
    } catch (error) {
        error.status = 400;
        next(error);
    }

}


getSignedToken = user => {
    return jwt.sign({
        id: user._id,
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName
    }, SECRET_KEY, { expiresIn: '1h' });
}
