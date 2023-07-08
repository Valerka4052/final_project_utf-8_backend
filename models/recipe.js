const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const addIngredientShema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    area: Joi.string().required(),
    instructions: Joi.string().required(),
    description: Joi.string().required(),
    thumb: Joi.string().required(),
    preview: Joi.string().required(),
    time: Joi.string().required(),
    youtube: Joi.string().required(),
    tags: Joi.array().required(),
    ingredients: Joi.array().required(),
}).messages({
    'any.required': 'missing required {#label} field',
    'object.missing': 'Fields {#context.missing} are missing'
});

// const updateFavoriteShema = Joi.object({ favorite: Joi.bool().required().messages({ 'any.required': 'missing field {#label}' }) });

const IngrSchema = new Schema({
    id:{type:String}
    // {
    //     type: Schema.Types.ObjectId,
    //     ref: 'ingredient',
    //     required: true
    // }
    ,
    measure: {
        type: String,
        required: true,
    }
});

const recipeSchema = new Schema({
    title: {
        type: String,
        // required: true,
    },
    category: {
        type: String,
        // required: true,
    },
    area: {
        type: String,
        // required: true,
    },
    instructions: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    thumb: {
        type: String,
        // required: true,
    },
    preview: {
        type: String,
        // required: true,
    },
    time: {
        type: String,
        // required: true,
    },
    youtube: {
        type: String,
        required: true,
    },
    tags:  [String],
    ingredients: [IngrSchema],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    favorite: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    }]
}, {
    versionKey: false, timestamps: true,
});

recipeSchema.post("save", handleMongooseError);
// const schemas = { addContactShema, updateFavoriteShema };
const Recipe = model('Recipe', recipeSchema);
module.exports = { Recipe };