const express = require("express");
const operationsRouter = express.Router();
const {isValid,isValidIdByReqBody} = require('../middlewares/isValidId');
const authenticate = require('../middlewares/authenticate');
const { validated } = require('../middlewares/validateBody');
const { schemas } = require('../models/user');
const {
    getListsByCategories,
    getAllCategories,
    getRecipeById,
    getListsByCategoriesPage,
    searchRecipes,
    getAllIngredients,
    getRecipesByIngredient,
    getRecipeByUser,
    addRecipe,
    deleteRecipe,
    getFavoriteRecipeByUser,
    addRecipeToFavorite,
    deleteRecipeFromFavorite,
    getPouplarRecipes,
    getShoppingList,
    addProductToSoppingList,
    removeProductFromSoppingList,
    subscribe,
} = require('../controllers/operations');
const upload = require("../middlewares/upload");
const { addRecipeShema } = require('../models/recipe');

operationsRouter.post('/subscribe', authenticate, subscribe);
operationsRouter.get('/recipes/main-page', authenticate, getListsByCategories);
operationsRouter.get('/recipes/category-list', authenticate, getAllCategories);
operationsRouter.get('/recipes/category/:category', authenticate, getListsByCategoriesPage);
operationsRouter.get('/recipes/:id', isValid, authenticate, getRecipeById);
operationsRouter.get('/search', authenticate, searchRecipes);
operationsRouter.get('/ingredients/list', authenticate, getAllIngredients);
operationsRouter.get('/ingredients', authenticate,  getRecipesByIngredient);
operationsRouter.get('/ownRecipes', authenticate, getRecipeByUser);
operationsRouter.post('/ownRecipes', authenticate,upload.single("documents"),validated(addRecipeShema), addRecipe);
operationsRouter.patch('/ownRecipes', authenticate, isValidIdByReqBody, deleteRecipe);
operationsRouter.get('/favorite', authenticate, getFavoriteRecipeByUser);
operationsRouter.post('/favorite', authenticate, isValidIdByReqBody,validated(schemas.shoppingListSchema), addRecipeToFavorite);
operationsRouter.patch('/favorite', authenticate, isValidIdByReqBody, deleteRecipeFromFavorite);
operationsRouter.get('/popular-recipe', authenticate, getPouplarRecipes);
operationsRouter.post('/shopping-list', authenticate, addProductToSoppingList);
operationsRouter.patch('/shopping-list', authenticate,  removeProductFromSoppingList);
operationsRouter.get('/shopping-list', authenticate, getShoppingList);

module.exports = operationsRouter