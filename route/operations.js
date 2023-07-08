const express = require("express");
const operationsRouter = express.Router();
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
} = require('../controllers/operations');

operationsRouter.get('/recipes/main-page', getListsByCategories);
operationsRouter.get('/recipes/category-list', getAllCategories);
operationsRouter.get('/recipes/{category}', getListsByCategoriesPage);
operationsRouter.get('/recipes/:id', getRecipeById);
operationsRouter.post('/search', searchRecipes);
operationsRouter.get('/ingredients/list', getAllIngredients);
operationsRouter.post('/ingredients', getRecipesByIngredient);
operationsRouter.get('/ownRecipes', getRecipeByUser);
operationsRouter.post('/ownRecipes', addRecipe);
operationsRouter.delete('/ownRecipes', deleteRecipe);
operationsRouter.get('/favorite', getFavoriteRecipeByUser);
operationsRouter.post('/favorite', addRecipeToFavorite);
operationsRouter.patch('/favorite', deleteRecipeFromFavorite);
operationsRouter.get('/popular-recipe', getPouplarRecipes);
operationsRouter.get('/shopping-list', getShoppingList);
operationsRouter.post('/shopping-list', addProductToSoppingList);
operationsRouter.patch('/shopping-list', removeProductFromSoppingList);




module.exports = operationsRouter