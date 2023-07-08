const express = require("express");
const operationsRouter = express.Router();
const { getListsByCategories, getAllCategories, getRecipeById, getListsByCategoriesPage,searchRecipes,getAllIngredients,getRecipesByIngredient } = require('../controllers/operations');
operationsRouter.get('/recipes/main-page', getListsByCategories);
operationsRouter.get('/recipes/category-list', getAllCategories);
operationsRouter.get('/recipes/{category}', getListsByCategoriesPage);
operationsRouter.get('/recipes/:id', getRecipeById);
operationsRouter.post('/search', searchRecipes);
operationsRouter.get('/ingredients/list', getAllIngredients);
operationsRouter.post('/ingredients', getRecipesByIngredient);





module.exports = operationsRouter