const { Schema, model } = require('mongoose');
const { hahdleMongooseError } = require('../helpers');
const Joi = require('joi');

const addIngredientShema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    img: Joi.string().required(),
}).messages({
  'any.required': 'missing required {#label} field',
  'object.missing': 'Fields {#context.missing} are missing'
});

// const updateFavoriteShema = Joi.object({ favorite: Joi.bool().required().messages({ 'any.required': 'missing field {#label}' }) });

const ingredientSchema = new Schema({
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

ingredientSchema.post("save", hahdleMongooseError);
const schemas = { addContactShema, updateFavoriteShema };
const Ingredient = model('Ingredient', ingredientSchema);
module.exports = { Ingredient, schemas };