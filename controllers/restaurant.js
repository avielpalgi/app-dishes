const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const Review = require('../models/Review');


module.exports = {
    index: async (req, res, next) => {
        const restaurants = await Restaurant.find({}).populate({ path: 'Menu', model: 'dish', populate: { path: 'Reviews', model: 'review' } })
            .then(rests => res.status(200).json(rests))
            .catch(err => res.status(400).json('Error: ' + err))
    },
    newRestaurant: async (req, res, next) => {
        const rest = await Restaurant.findOne({ Name: req.body.Name });
        if (rest) {
            return res.status(403).json({ error: { message: 'restaurant already in use' } })
        }
        const newRest = new Restaurant(req.body);
        try {
            await newRest.save();
            res.status(200).json(newRest);
        } catch (error) {
            error.status = 400;
            next(error);
        }

    },
    getRestaurant: async (req, res, next) => {
        const { restId } = req.params;
        const restaurant = await Restaurant.findById(restId).populate({ path: 'Menu', model: 'dish', populate: { path: 'Reviews', model: 'review' } })
            .then(rest => res.status(200).json(rest))
            .catch(err => res.status(400).json('Error: ' + err))
    },
    replaceRestaurant: async (req, res, next) => {
        const { restId } = req.params;
        const newRest = req.body;
        const result = await Restaurant.findByIdAndUpdate(restId, newRest)
            .then(rest => res.status(200).json({ success: true }))
            .catch(err => res.status(400).json('Error: ' + err))
    },
    updateRestaurant: async (req, res, next) => {
        const { restId } = req.params;
        const newRest = req.body;
        const result = await Restaurant.findByIdAndUpdate(restId, newRest)
            .then(rest => res.status(200).json({ success: true }))
            .catch(err => res.status(400).json('Error: ' + err))
    },
    getRestDishes: async (req, res, next) => {
        const { restId } = req.params;
        const restaurant = await Restaurant.findById(restId).populate({ path: 'Menu', model: 'dish', populate: { path: 'Reviews', model: 'review' } })
            .then(rest => res.status(200).json(rest.Menu))
            .catch(err => res.status(400).json('Error: ' + err))
    },
    newRestDish: async (req, res, next) => {
        const { restId } = req.params;
        const newDish = new Dish(req.body);
        const restaurant = await Restaurant.findById(restId).populate({ path: 'Menu', model: 'dish', populate: { path: 'Reviews', model: 'review' } });
        try {
            newDish.Restaurant = restaurant;
            await newDish.save();
            restaurant.Menu.push(newDish);
            await restaurant.save();
            res.status(200).json(newDish);
        } catch (error) {
            error.status = 400;
            next(error);
        }
    }
};