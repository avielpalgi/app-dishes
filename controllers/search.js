const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const Review = require('../models/Review');
const User = require('../models/User');

module.exports = {
    getDetails: async (req, res, next) => {
        let TypeDishes = [];
        let areaDishes = [];
        let cityDishes = [];
        const dish = await Dish.find({}).populate('Restaurant');
        dish.map((d) => TypeDishes.push({key:d.Type}))
        dish.map((d) => areaDishes.push({key:d.Restaurant.area}))
        dish.map((d) => cityDishes.push({key:d.Restaurant.City}))
        let dType = distinct(TypeDishes);
        let dArea = distinct(areaDishes);
        let dCity = distinct(cityDishes);
        let result = {
            Types: dType,
            Areas: dArea,
            Cities:dCity
        }
        res.status(200).json(result);
    }
}

distinct = (data) => {
    var resArr = [];
    data.forEach(function (item) {
        var i = resArr.findIndex(x => x.key == item.key);
        if (i <= -1) {
            resArr.push(item);
        }
    });
    return resArr
}