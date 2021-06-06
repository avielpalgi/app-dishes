
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const Review = require('../models/Review');
const User = require('../models/User');


module.exports = {
    index: async (req, res, next) => {
        const dish = await Dish.find({}).populate({ path: 'Reviews', model: 'review', populate: { path: 'UserID', model: 'user' } }).populate({ path: 'Restaurant', model: 'restaurant', populate: { path: 'Menu', model: 'dish' } });
       
        let sum = 0;
        let temp = [];
        for (let i = 0; i < dish.length; i++) {
            sum = 0;
            const element = dish[i];
            if (element.Reviews.length > 0) {
                for (let j = 0; j < element.Reviews.length; j++) {
                    const review = element.Reviews[j];
                    sum += review.Rank;
                }
                element.AvgRank = sum / element.Reviews.length;
            }
            for (let j = 0; j < element.Restaurant.Menu.length; j++) {
                const restDish = element.Restaurant.Menu[j];
                if (restDish.Name === element.Name) {
                    restDish.AvgRank = sum / element.Reviews.length;
                }
            }
            temp.push(element);
        }
        res.status(200).json(temp);
    },
    getDish: async (req, res, next) => {
        const { dishId } = req.params;
        const dish = await Dish.findById(dishId).populate('Reviews').populate('User');
        res.status(200).json(dish);
    },
    updateDish: async (req, res, next) => {
        const { dishId } = req.params;
        const newDish = req.body;
        const result = await Dish.findByIdAndUpdate(dishId, newDish);
        res.status(200).json({ success: true })
    },
    getDishReviews: async (req, res, next) => {
        const { dishId } = req.params;
        const dish = await (await Dish.findById(dishId).populate('Reviews').populate('User'));
        res.status(200).json(dish.Reviews);
    },
    newDishReview: async (req, res, next) => {
        const { dishId } = req.params;
        const newReview = new Review(req.body);
        const dish = await Dish.findById(dishId);
        newReview.DishId = dish;
        try {
            await newReview.save();
            dish.Reviews.push(newReview);
            await dish.save();
            res.status(200).json(dish.Reviews.populate('Reviews').populate('User'));
        } catch (error) {
            error.status = 400;
            next(error);
        }
    }
};