const { Recipe } = require('../models/recipe');
const { Category } = require('../models/categories');
const { Ingredient } = require('../models/ingredient');
const { funcWrapper, HttpError } = require("../helpers");

const getListsByCategories = async (req, res) => {
    const categories = await Category.find()
    if (!categories) return HttpError(404, 'categories not found');
    const categoryNames = categories.map(category => category.name).sort();
    const recipes = await Promise.all(categoryNames.map(async (category) => {
        const result = await Recipe.find({ category });
        return { [category]: result };
    }));
    if (!recipes) return HttpError(404, 'not found');
    res.status(200).json(recipes);
};

const getAllCategories = async (req, res) => {
    const categories = await Category.find();
    if (!categories) return HttpError(404, 'not found');
    const sortedcategories = categories.map(category => category.name).sort();
    res.status(200).json(sortedcategories);
};

const getListsByCategoriesPage = async (req, res) => {
    const categories = await Category.find()
    if (!categories) return HttpError(404, 'not found');
    const categoryNames = categories.map(category => category.name).sort();
    const recipes = await Promise.all(categoryNames.map(async (category) => {
        const result = await Recipe.find({ category }).limit(8);
        return { [category]: result };
    }));
    if (!recipes) return HttpError(404, 'recipes not found');
    res.status(200).json(recipes);
};
const getRecipeById = async (req, res) => {
    const { id } = req.params;
    if(!id) return HttpError(404, 'not found');
    const recipe = await Recipe.findById(id);
    if (!recipe) return HttpError(404, 'not found');
    res.status(200).json(recipe);
};

const searchRecipes = async (req, res) => {
    const { search } = req.body;
    if(!search) return HttpError(404, 'not found');
    const recipes = await Recipe.find({ title: { $regex: search, $options: 'i' } });
     if (!recipes) return HttpError(404, 'not found');
    res.status(200).json(recipes);
};

const getAllIngredients = async (req, res) => {
    const ingredients = await Ingredient.find();
    if (!ingredients) return HttpError(404, 'recipes not found');
    res.status(200).json(ingredients);
};

const getRecipesByIngredient = async (req, res) => {
    const { id } = req.body;
    console.log(id);
    const recipes = await Recipe.find({ ingredients: { $elemMatch: { id: ObjectId(id), }, }, });
    if (!recipes) return HttpError(404, 'recipes not found');
    res.status(200).json(recipes);
};


module.exports = {
    getListsByCategories: funcWrapper(getListsByCategories),
    getAllCategories: funcWrapper(getAllCategories),
    getListsByCategoriesPage: funcWrapper(getListsByCategoriesPage),
    getRecipeById: funcWrapper(getRecipeById),
    searchRecipes: funcWrapper(searchRecipes),
    getAllIngredients: funcWrapper(getAllIngredients),
    getRecipesByIngredient: funcWrapper(getRecipesByIngredient),
};