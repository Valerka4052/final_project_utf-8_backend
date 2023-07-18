const { Recipe } = require("../models/recipe");
const { Category } = require("../models/categories");
const { Ingredient } = require("../models/ingredient");
const { User } = require("../models/user");
const { funcWrapper, HttpError, sendEmail } = require("../helpers");
const subscribe = async (req, res) => {
  const { _id } = req.user;
  const { email } = req.body;
  const subscribeEmail = email;

  await User.findByIdAndUpdate(_id, { subscribeEmail });
  const verifyEmail = {
    to: email,
    subject: "Subscribe",
    html: ` <h1
        target="_blank"
      >
        You subscribed to Soyummy !
      </h1>`,
  };
  await sendEmail(verifyEmail);
  res.status(200).json({ message: 'sucsess' });
};

const getListsByCategories = async (req, res) => {
  // const categories = await Category.find();
  // if (!categories) return HttpError(404, "categories not found");
  // const categoryNames = categories.map((category) => category.name).sort();
  const categories = ['Breakfast', 'Miscellaneous', 'Chicken', 'Dessert'];
  const recipes = await Promise.all(
    categories.map(async (category) => {
      const result = await Recipe.find({ category }).populate("ingredients.id").limit(4);
      return { [category]: result };
    })
  );
  if (!recipes) return HttpError(404, "not found");
  res.status(200).json(recipes);
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  if (!categories) return HttpError(404, "not found");
  const sortedcategories = categories.map((category) => category.name).sort();
  res.status(200).json(sortedcategories);
};

const getListsByCategoriesPage = async (req, res) => {
  const { category } = req.params;
  const list = await Recipe.find({ category }).limit(8);
  if (!list) return HttpError(404, "not found");
  res.status(200).json(list);
};

const getRecipeById = async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;
  if (!id) return HttpError(404, "not found");
  const recipe = await Recipe.findById(id).populate("ingredients.id");
  if (!recipe) return HttpError(404, "not found");
  const isFavorite = recipe.favorite.some(favorite => favorite.id === userId);
  res.status(200).json({...recipe._doc,isFavorite});
};

const searchRecipes = async (req, res) => {
  // const { search } = req.body;
  const { page = 1, search, limit = 8 } = req.query;
  const { _id } = req.user;
  const skip = (page - 1);
  const recipesLength = await Recipe.find({ title: { $regex: search, $options: "i" }, })
  const totalPages = Math.ceil(recipesLength.length / limit);
  if (!search) return HttpError(404, "not found");
  const recipes = await Recipe.find({ title: { $regex: search, $options: "i" }, }).skip(skip).limit(limit);
  if (!recipes) return HttpError(404, "not found");
  res.status(200).json({ recipes, totalPages });
};

const getAllIngredients = async (req, res) => {
  const ingredients = await Ingredient.find();
  if (!ingredients) throw HttpError(404, "not found");
  res.status(200).json(ingredients);
};

const getRecipesByIngredient = async (req, res) => {
  // const { search } = req.body;
  const { page = 1, search, limit = 8 } = req.query;
  const { _id } = req.user;
  const skip = (page - 1);
  const ingredients = await Ingredient.find({ name: { $regex: search, $options: "i" }, });
  const ingrIds = ingredients.map(ingredient => ingredient.id);
  const recipesLength = await Recipe.find({ ingredients: { $elemMatch: { id: { $in: ingrIds } } } });
  const totalPages = Math.ceil(recipesLength.length / limit);
  const recipes = await Recipe.find({ ingredients: { $elemMatch: { id: { $in: ingrIds } } } }).skip(skip).limit(limit);
  if (!recipes) return HttpError(404, "not found");
  res.status(200).json({recipes,totalPages});
};

const getRecipeByUser = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1);
  const recipesLength = await Recipe.find({ owner: _id }).length;
  const totalPages = Math.ceil(recipesLength / limit);
  const recipes = await Recipe.find({ owner: _id }).skip(skip).limit(limit);
  if (!recipes) return HttpError(404, "recipes not found");
  res.status(200).json({ recipes, totalPages });
};

const addRecipe = async (req, res) => {
  const { _id } = req.user;
  const { path } = req.file;
  console.log("req.body", req.body);
  const recipe = await Recipe.create({ ...req.body, owner: _id });
  if (!recipe) return HttpError(404, 'not found');
  res.status(200).json(recipe);
};

const deleteRecipe = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.body;
  const deletedRecipe = await Recipe.findOneAndDelete({ owner: _id, _id: id });
  if (!deletedRecipe) return HttpError(404, "not found");
  res.status(200).json({ message: "recipe is deleted" });
};

const getFavoriteRecipeByUser = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const { id } = req.user;
  const skip = (page - 1);
  const recipes = (await Recipe.find({ favorite: { $elemMatch: { id } } })).length;
  const totalPages = Math.ceil(recipes / limit);
  const userRecipes = await Recipe.find({ favorite: { $elemMatch: { id } } }).skip(skip).limit(limit);
  if (!userRecipes) throw HttpError(404, "not found");
  return res.status(200).json({ favorites: userRecipes, totalPages });
};

const addRecipeToFavorite = async (req, res) => {
  const { id: resId } = req.body;
  const updatedReciepe = await Recipe.findByIdAndUpdate(
    resId,
    { $push: { favorite:{id: req.user.id} } },
    { new: true }
  );
  if (!updatedReciepe) return HttpError(404, "recipes not found");
  return res.status(200).json({ message: "recipe has scsessfully added to favorite" });
};

const deleteRecipeFromFavorite = async (req, res) => {
  const { id } = req.user;
  const { id: resId } = req.body;
  const deletedFromFavorite = await Recipe.findByIdAndUpdate(
    resId,
    { $pull: { favorite: { id } } },
    { new: true }
  );
  if (!deletedFromFavorite) return HttpError(404, "recipes not found");
  res.status(200).json(deletedFromFavorite);
};

const getPouplarRecipes = async (req, res) => {
  const recipes = await Recipe.find();
  if (!recipes) return HttpError(404, "recipes not found");
  const filteredRecipes = recipes.map((recipe) => {
    if (!recipe.favorite) {
      return (recipe.favorite = []);
    } else {
      return recipe;
    }
  });
  const compareByArrayLength = (a, b) => {
    const lengthA = a.favorite.length;
    const lengthB = b.favorite.length;
    if (lengthA > lengthB) return -1;
    if (lengthA < lengthB) return 1;
    return 0;
  };
  const result = filteredRecipes.sort(compareByArrayLength);
  res.status(200).json(result);
};

const addProductToSoppingList = async (req, res) => {
  const { _id: userId } = req.user;
  const { ingredientId, uniqId, measure,recipeId } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { shoppingList: { _id: ingredientId, measure, uniqId, recipeId } } },
    { new: true }
  )
  if (!updatedUser) return HttpError(404, "not found");
  return res.status(200).json(updatedUser.shoppingList);
};

const removeProductFromSoppingList = async (req, res) => {
  const { _id: userId } = req.user;
  const { uniqId } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { shoppingList: { uniqId } } },
    { new: true }
  )
  if (!updatedUser) return HttpError(404, "not found");
  return res.status(200).json(updatedUser.shoppingList);
};
const getShoppingList = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("shoppingList._id");
  if (!user) return HttpError(404, "not found");
  const list = user.shoppingList;
  res.status(200).json(list);
};
const getUserInfo = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("shoppingList");
  if (!user) return HttpError(404, "not found");
  const userRecipes = await Recipe.find({
    favorite: { $elemMatch: { _id } },
  }).populate("favorite");
  if (!userRecipes) return HttpError(404, "not found");
  const date1 = new Date(user.createdAt);
  const date2 = new Date();
  const difference = date2 - date1;
  const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
  res.status(200).json({
    daysInApp: daysDifference,
    favoriteRecipes: userRecipes,
    shoppingList: user.shoppingList,
  });
};

module.exports = {
  subscribe: funcWrapper(subscribe),
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
  getUserInfo: funcWrapper(getUserInfo),
};



