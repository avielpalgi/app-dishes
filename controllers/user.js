const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const fetch = require('node-fetch');
const {OAuth2Client} = require('google-auth-library')

const client = new OAuth2Client("894154508942-abj25d49dcrkjigeei6a5hedmjn2cu19.apps.googleusercontent.com")
exports.register = async (req, res, next) => {
    const { FirstName, LastName, Email, Password } = req.body
    const user = await User.findOne({ Email });
    if (user) { //אם קיים משתמש
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

exports.facebookLogin = async (req, res, next) => {
    const { userID, accessToken } = req.body;

    let urlGraphFacebook = `https://graph.facebook.com/v10.0/${userID}?fields=id,first_name,last_name,email,picture.width(280).height(280)&access_token=${accessToken}`
    fetch(urlGraphFacebook, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(async (response) => {
            const Email = response.email;
            const user = await User.findOne({ Email });
            if (user) {
                try {
                    if (user.Picture == "") {
                        await User.update({ _id: user._id }, {
                            info: "some new info",
                            Picture: response.picture.data.url
                        }, function (err, affected, resp) {
                            console.log(resp);
                        })
                    }

                    let token = getSignedToken(user);
                    res.status(200).json({ token });
                } catch (error) {
                    error.status = 400;
                    next(error);
                }
            }
            else {
                let newUser = {
                    FirstName: response.first_name,
                    LastName: response.last_name,
                    Email: response.email,
                    Password: SECRET_KEY,
                    Picture: response.picture.data.url
                }
                newUser = new User(newUser);
                try {
                    newUser.save();
                    let token = getSignedToken(newUser);
                    res.status(200).json({ token });
                } catch (error) {
                    error.status = 400;
                    next(error);
                }
            }
        });
}

exports.googleLogin = async (req, res, next) => {
    const {tokenId} = req.body;
    client.verifyIdToken({idToken:tokenId,audience:"894154508942-abj25d49dcrkjigeei6a5hedmjn2cu19.apps.googleusercontent.com"})
    .then(async(response)=>{
        console.log(response);
        const {email_verified, family_name,given_name,picture, email} = response.payload;
       console.log(response.payload);
       if (email_verified) {
           const Email = email;
           const user = await User.findOne({Email})
           if (user) {
            try {
                if (user.Picture == "") {
                    await User.update({ _id: user._id }, {
                        info: "some new info",
                        Picture: picture
                    }, function (err, affected, resp) {
                        console.log(resp);
                    })
                }

                let token = getSignedToken(user);
                res.status(200).json({ token });
            } catch (error) {
                error.status = 400;
                next(error);
            }
        }
        else {
            let newUser = {
                FirstName: given_name,
                LastName: family_name,
                Email: email,
                Password: SECRET_KEY,
                Picture: picture
            }
            newUser = new User(newUser);
            try {
                newUser.save();
                let token = getSignedToken(newUser);
                res.status(200).json({ token });
            } catch (error) {
                error.status = 400;
                next(error);
            }
        }
       }
    })

}

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

exports.DeleteFavorite = async (req, res, next) => {
    const userId = req.params.userId;
    const dish = req.body;
    const user = await User.findById(userId).populate('Favorites');

    try {
        if (user) {
            await user.updateOne({ $pull: { "Favorites": dish._id } });
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
        LastName: user.LastName,
        Picture: user.Picture
    }, SECRET_KEY, { expiresIn: '1h' });
}
