const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const IngredientSchema = new Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
}, { versionKey: false });

IngredientSchema.post("save", handleMongooseError);
const Ingredient = model('Ingredient', IngredientSchema);
module.exports = { Ingredient };