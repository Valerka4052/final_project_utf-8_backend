const { Schema, model } = require('mongoose');
const { hahdleMongooseError } = require('../helpers');
const Joi = require('joi');

// const addIngredientShema = Joi.object({
//     name: Joi.string().required(),
//     desc: Joi.string().required(),
//     img: Joi.string().required(),
// }).messages({
//   'any.required': 'missing required {#label} field',
//   'object.missing': 'Fields {#context.missing} are missing'
// });

// const updateFavoriteShema = Joi.object({ favorite: Joi.bool().required().messages({ 'any.required': 'missing field {#label}' }) });

const reciepeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
         required: true,
    },
    area: {
        type: String,
         required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    description: {
        type: String,
         required: true,
    },
    thumb: {
        type: String,
         required: true,
    },
       preview: {
        type: String,
         required: true,
    },
        time: {
        type: String,
        required: true,
    },
    youtube: {
        type: String,
         required: true,
    },
    tags: {
        type: Array,
         required: true,
    },
     ingredients: {
        type: Array,
         required: true,
    },
}, {
    versionKey: false, timestamps: true
});

ingredientSchema.post("save", hahdleMongooseError);
const schemas = { addContactShema, updateFavoriteShema };
const Ingredient = model('Ingredient', ingredientSchema);
module.exports = { Ingredient, schemas };