const express = require('express')
const router = express.Router()
const User = require('../models/User')
const UserSession = require('../models/UserSession');
const userController = require('../controllers/user');
const restaurantController = require('../controllers/restaurant');
const dishController = require('../controllers/dish');
router.route('/users').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
}); // Get All Users

router.route('/rests').get((req, res) => {
    Rest.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/users/signin', (request, response, next) => {
    const { body } = request;
    const {
        Password
    } = body;
    let {
        Email
    } = body

    if (!Email) {
        return response.send({
            success: false,
            message: 'Error: Email Name Cannot be Empty'
        })
    }
    if (!Password) {
        return response.send({
            success: false,
            message: 'Error: Password Name Cannot be Empty'
        })
    }

    let e = Email.toLowerCase();
    User.find({
        Email: e
    }, (err,users)=>{
        if (err) {
            return response.send({
                success: false,
                message: 'Error: Server error'
            });
        }
        if (users.length != 1) {
            return response.send({
                success: false,
                message: 'Error:Invalid'
            });
        }
        const user = users[0];
        if (!user.validPassword(Password)) {
            return response.send({
                success: false,
                message: 'Error: Invalid'
            });
        }
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err,doc)=>{
            if (err) {
                return response.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            return response.send({
                success: true,
                message:'Valid sign in',
                token: doc._id
            })

        })
    });
});


router.post('/users', (request, response, next) => {

    const { body } = request;
    const {
        FirstName,
        LastName,
        Email,
        Password
    } = body;

    if (!FirstName) {
        return response.send({
            success: false,
            message: 'Error: First Name Cannot be Empty'
        })
    }
    if (!LastName) {
        return response.send({
            success: false,
            message: 'Error: Last Name Cannot be Empty'
        })
    }
    if (!Email) {
        return response.send({
            success: false,
            message: 'Error: Email Name Cannot be Empty'
        })
    }
    if (!Password) {
        return response.send({
            success: false,
            message: 'Error: Password Name Cannot be Empty'
        })
    }
    let e = Email.toLowerCase();
    //Email = Email.toLowerCase();
    User.find({
        Email: e
    }, (err, previousUsers) => {
        if (err) {
            return response.send({
                success: false,
                message: 'Error: Server error'
            })
        }
        else if (previousUsers.length > 0) {
            return response.send({
                success: false,
                message: 'Error: Account already exist.'
            })
        }

        const newUser = new User();
        newUser.Email = e;
        newUser.FirstName = FirstName;
        newUser.LastName = LastName;
        newUser.Password = newUser.generateHash(Password);
        newUser.save((err,user)=>{
            if (err) {
                return response.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            return response.send({
                success: true,
                message:'Signed up'
            });
        });
    });
});

router.get('/users/verify', (req,res,next)=>{
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    UserSession.find({
        _id:token,
        isDeleted:false
    },(err,sessions)=>{
        if (err) {
            return res.send({
                success:false,
                message:"Error: Server error"
            });
        }
        if (sessions.length != 1) {
            console.log(sessions);
            return res.send({
                success:false,
                message:"Error: Invalid"
            });
        }
        else{
            return res.send({
                success:true,
                message:"Good"
            });
        }
    })

 
});

router.get('/users/logout',(req,res,next)=>{
    const {query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate({
        _id:token,
        isDeleted:false
    },{$set:{isDeleted:true}}
    ,null,(err,sessions)=>{
        if (err) {
            return res.send({
                success:false,
                message:"Error: Server error"
            });
        }

            return res.send({
                success:true,
                message:"Good"
            });
    })
}); 

router.post('/users/register',userController.register); //Register Controller
router.post('/users/login',userController.login);  //Login Controller
router.post('/users/facebookLogin',userController.facebookLogin) // Login with Facebook
router.post('/users/googleLogin',userController.googleLogin) // Login with Google

router.post('/favorites/:userId',userController.AddtoFavorite)

router.get('/favorites/:userId',userController.GetUserFavorites);
router.post('/favorites/:userId/del',userController.DeleteFavorite);

// router.get('/restaurants/getAll',restaurantController.getAll); //Get All Restaurants
// router.post('/restaurants/addNew',restaurantController.addNew); //Add new Restaurant
// router.post('/restaurants/addDish/:id',restaurantController.addDish) //add New Dish to specific restaurant 
// router.post('/restaurants/addReview/:id',restaurantController.addReview) //add New Review to specific Dish 


// router.get('/dish/getAllDishes',dishController.getAllDishes); //Get All Dishes
// router.post('/dish/addNew',dishController.addNew); //add New Dish


router.route('/restaurant')
.get(restaurantController.index)
.post(restaurantController.newRestaurant);

router.route('/restaurant/:restId')
.get(restaurantController.getRestaurant)
.put(restaurantController.replaceRestaurant)
.patch(restaurantController.updateRestaurant)

router.route('/restaurant/:restId/dishes')
.get(restaurantController.getRestDishes)
.post(restaurantController.newRestDish)

router.route('/dish')
.get(dishController.index)

router.route('/dish/:dishId')
.get(dishController.getDish)
.put(dishController.updateDish)

router.route('/dish/:dishId/reviews')
.get(dishController.getDishReviews)
.post(dishController.newDishReview)

module.exports = router