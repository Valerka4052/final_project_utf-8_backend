const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const addRecipeShema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),

    instructions: Joi.string().required(),
    description: Joi.string().required(),
    time: Joi.string().required(),
    ingredients: Joi.string().required(),
}).messages({
    'any.required': 'missing required {#label} field',
    'object.missing': 'Fields {#context.missing} are missing'
});
const IngrSchema = new Schema({
    id: { type: String, ref: "Ingredient" },
    measure: { type: String },
});

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
         enum: [
        "Beef",
        "Breakfast",
        "Chicken",
        "Dessert",
        "Goat",
        "Lamb",
        "Miscellaneous",
        "Pasta",
        "Pork",
        "Seafood",
        "Side",
        "Starter",
        "Vegan",
        "Vegetarian",
      ],
    },
    area: {
        type: String,
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
       },
    preview: {
        type: String,
    },
    time: {
        type: String,
        required: true,
    },
    youtube: {
        type: String,
       },
    tags:  [String],
    ingredients: {
      _id: false,
      type: [IngrSchema],
      required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    favorite: {
        type: [{ id: { type: String, ref: 'user', } }],
        default:[],
    }
}, {
    versionKey: false, timestamps: true,
});

recipeSchema.post("save", handleMongooseError);
const Recipe = model('Recipe', recipeSchema);
module.exports = { Recipe, addRecipeShema };