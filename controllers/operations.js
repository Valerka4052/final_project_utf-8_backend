const { Recipe } = require('../models/recipe');
const { Category } = require('../models/categories');
const { Ingredient } = require('../models/ingredient');
const { User } = require('../models/user');
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
    if (!ingredients) return HttpError(404, 'not found');
    res.status(200).json(ingredients);
};

const getRecipesByIngredient = async (req, res) => {
    const { id } = req.body;
    console.log(id);
    const recipes = await Recipe.find({ ingredients: { $elemMatch: { id } } });
    if (!recipes) return HttpError(404, 'not found');
    res.status(200).json(recipes);
};

const getRecipeByUser = async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    const recipes = await Recipe.find({ owner: _id }).populate('owner');
    if (!recipes) return HttpError(404, 'recipes not found');
    res.status(200).json(recipes);
};

const addRecipe = async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    const recipe = await Recipe.create({ ...req.body, owner: _id }).populate('owner');
    if (!recipe) return HttpError(404, 'not found');
    res.status(201).json(recipe);
};

const deleteRecipe = async (req, res) => {
    const { _id } = req.user;
    const { id } = req.body;
    console.log(id);
    const deletedRecipe = await Recipe.findOneAndDelete({ owner: _id, _id: id }).populate('owner');
    if (!deletedRecipe) return HttpError(404, 'not found');
    res.status(200).json({ message: 'recipe is deleted' });
};

const getFavoriteRecipeByUser = async (req, res) => {
    const { _id } = req.user;
    const userRecipes = await Recipe.find({ favorite: _id });
    return res.status(200).json(userRecipes);

};

const addRecipeToFavorite = async (req, res) => {
    const { _id } = req.user;
    const { _id: resId } = req.body;
    const updatedReciepe = await Recipe.findByIdAndUpdate(resId, { $push: { favorite: { id: _id } } }, { new: true });
    return res.status(200).json(updatedReciepe);
};

const deleteRecipeFromFavorite = async (req, res) => {
    const { _id } = req.user;
    const { _id: resId } = req.body;
    const deletedFromFavorite = await Recipe.findOneAndUpdate(resId, { $pull: { favorite: { id: _id } } }, { new: true });
    res.status(200).json(deletedFromFavorite);
    // const deletedFromFavorite = await Recipe.findOneAndDelete({ _id: resId, favorite: _id });
    //  if (deletedFromFavorite === null) throw HttpError(404, 'not found');
    // res.status(200).json({ message: 'recipe is deleted from favorite' });
};

const getPouplarRecipes = async (req, res) => {

};

const getShoppingList = async (req, res) => {
    const { _id } = req.user;
    const { id: ingredientId } = req.body;
    const user = await User.findById(_id).populate('shoppingList');
    const list = user.shoppingList;
    res.status(200).json(list)
};

const addProductToSoppingList = async (req, res) => {
    const { _id } = req.user;
    const { id: ingredientId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(_id, { $push: { shoppingList: { id: ingredientId } } }, { new: true });
    return res.json.status(200).json(updatedUser.shoppingList);
    

}

const removeProductFromSoppingList = async (req, res) => {
    const { _id } = req.user;
    const { id: ingredientId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(_id, { $pull: { shoppingList: { id: ingredientId } } }, { new: true });
    return res.json.status(200).json(updatedUser.shoppingList);
};

module.exports = {
    getListsByCategories: funcWrapper(getListsByCategories),
    getAllCategories: funcWrapper(getAllCategories),
    getListsByCategoriesPage: funcWrapper(getListsByCategoriesPage),
    getRecipeById: funcWrapper(getRecipeById),
    searchRecipes: funcWrapper(searchRecipes),
    getAllIngredients: funcWrapper(getAllIngredients),
    getRecipesByIngredient: funcWrapper(getRecipesByIngredient),
    getRecipeByUser: funcWrapper(getRecipeByUser),
    addRecipe: funcWrapper(addRecipe),
    deleteRecipe: funcWrapper(deleteRecipe),
    getFavoriteRecipeByUser: funcWrapper(getFavoriteRecipeByUser),
    addRecipeToFavorite: funcWrapper(addRecipeToFavorite),
    deleteRecipeFromFavorite: funcWrapper(deleteRecipeFromFavorite),
    getPouplarRecipes: funcWrapper(getPouplarRecipes),
    getShoppingList: funcWrapper(getShoppingList),
    addProductToSoppingList: funcWrapper(addProductToSoppingList),
    removeProductFromSoppingList: funcWrapper(removeProductFromSoppingList),
};