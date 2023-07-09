const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const CategoriesSchema = new Schema({
    name: { type: String, required: true, },
}, { versionKey: false });

CategoriesSchema.post("save", handleMongooseError);
const Category = model('Category', CategoriesSchema);
module.exports = { Category };