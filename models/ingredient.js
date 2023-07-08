const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
// const Joi = require('joi');

// const addIngredientShema = Joi.object({
//     name: Joi.string().required(),
//     desc: Joi.string().required(),
//     img: Joi.string().required(),
// }).messages({
//   'any.required': 'missing required {#label} field',
//   'object.missing': 'Fields {#context.missing} are missing'
// });

// const updateFavoriteShema = Joi.object({ favorite: Joi.bool().required().messages({ 'any.required': 'missing field {#label}' }) });

const IngredientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
}, {
    versionKey: false, timestamps: true
});

// IngredientSchema.post("save", handleMongooseError);
// const schemas = { addIngredientShema };
const Ingredient = model('Ingredient', IngredientSchema);
module.exports = { Ingredient };