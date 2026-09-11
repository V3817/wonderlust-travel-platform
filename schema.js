const joi = require('joi');

const listingSchema = joi.object({
    title: joi.string().required(),
    image: joi.string().allow('', null),
    description: joi.string().required(),
    price: joi.number().min(0).required(),
    location: joi.string().required(),
    country: joi.string().required()
});

const reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().min(5).required()
    }).required()
});

module.exports = {
    listingSchema,
    reviewSchema
};
