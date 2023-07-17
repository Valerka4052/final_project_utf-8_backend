const express = require("express");
const operationsRouter = express.Router();
const {isValid,isValidIdByReqBody} = require('../middlewares/isValidId');
const authenticate = require('../middlewares/authenticate');
const { validated } = require('../middlewares/validateBody');
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
    getUserInfo
} = require('../controllers/operations');
const upload = require("../middlewares/upload");

operationsRouter.post('/subscribe', authenticate, subscribe);
operationsRouter.get('/recipes/main-page', authenticate, getListsByCategories);
operationsRouter.get('/recipes/category-list', authenticate, getAllCategories);
operationsRouter.get('/recipes/category/:category', authenticate, getListsByCategoriesPage);
operationsRouter.get('/recipes/:id', isValid, authenticate, getRecipeById);
operationsRouter.post('/search', authenticate, searchRecipes);
operationsRouter.get('/ingredients/list', authenticate, getAllIngredients);
operationsRouter.post('/ingredients', authenticate,  getRecipesByIngredient);
operationsRouter.get('/ownRecipes', authenticate, getRecipeByUser);
operationsRouter.post('/ownRecipes', authenticate,upload.single("documents"), addRecipe);
operationsRouter.patch('/ownRecipes', authenticate, isValidIdByReqBody, deleteRecipe);
operationsRouter.get('/favorite', authenticate, getFavoriteRecipeByUser);
operationsRouter.post('/favorite', authenticate, isValidIdByReqBody, addRecipeToFavorite);
operationsRouter.patch('/favorite', authenticate, isValidIdByReqBody, deleteRecipeFromFavorite);
operationsRouter.get('/popular-recipe', authenticate, getPouplarRecipes);
operationsRouter.post('/shopping-list', authenticate,  addProductToSoppingList);
operationsRouter.patch('/shopping-list', authenticate,  removeProductFromSoppingList);
operationsRouter.get('/shopping-list', authenticate, getShoppingList);
operationsRouter.get('/user-info', authenticate, getUserInfo);

module.exports = operationsRouter