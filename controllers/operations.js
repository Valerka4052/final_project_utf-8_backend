const { Recipe } = require("../models/recipe");
const { Category } = require("../models/categories");
const { Ingredient } = require("../models/ingredient");
const { User } = require("../models/user");
const { ObjectId } = require("mongoose").Types;
const { funcWrapper, HttpError, sendEmail } = require("../helpers");

const subscribe = async (req, res) => {
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
};

const getListsByCategories = async (req, res) => {
  const categories = await Category.find();
  if (!categories) return HttpError(404, "categories not found");
  const categoryNames = categories.map((category) => category.name).sort();
  const recipes = await Promise.all(
    categoryNames.map(async (category) => {
      const result = await Recipe.find({ category }).limit(4);
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
  // const { name } = await Category.findOne({ name: category });
  const list = await Recipe.find({ category }).limit(8);
  res.status(200).json(list);
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;
  if (!id) return HttpError(404, "not found");
  const recipe = await Recipe.findById(id).populate('ingredients');
  if (!recipe) return HttpError(404, "not found");
  res.status(200).json(recipe);
};

const searchRecipes = async (req, res) => {
  const { search } = req.body;
  if (!search) return HttpError(404, "not found");
  const recipes = await Recipe.find({
    title: { $regex: search, $options: "i" },
  });
  if (!recipes) return HttpError(404, "not found");
  res.status(200).json(recipes);
};

const getAllIngredients = async (req, res) => {
  const ingredients = await Ingredient.find();
  if (!ingredients) throw HttpError(404, "not found");
  res.status(200).json(ingredients);
};

const getRecipesByIngredient = async (req, res) => {
  const { id } = req.body;
  const recipes = await Recipe.find({ ingredients: { $elemMatch: { id } } });
  if (!recipes) return HttpError(404, "not found");
  res.status(200).json(recipes);
};

const getRecipeByUser = async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  const recipes = await Recipe.find({ owner: _id });
  if (!recipes) return HttpError(404, "recipes not found");
  res.status(200).json(recipes);
};

const addRecipe = async (req, res) => {
  const { _id } = req.user;
  const { path } = req.file;
  console.log("req.body", req.body);
  // const recipe = await Recipe.create({ ...req.body, owner: _id })
  // if (!recipe) return HttpError(404, 'not found');
  res.status(200).json(req.file);
};

const deleteRecipe = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.body;
  console.log(id);
  const deletedRecipe = await Recipe.findOneAndDelete({ owner: _id, _id: id });
  if (!deletedRecipe) return HttpError(404, "not found");
  res.status(200).json({ message: "recipe is deleted" });
};

const getFavoriteRecipeByUser = async (req, res) => {
  const { _id } = req.user;
  const userRecipes = await Recipe.find({ favorite: { $elemMatch: { _id } } });
  if (!userRecipes) throw HttpError(404, "recipes not found");
  return res.status(200).json(userRecipes);
};

const addRecipeToFavorite = async (req, res) => {
  const { _id } = req.user;
  const { id: resId } = req.body;
  const updatedReciepe = await Recipe.findByIdAndUpdate(
    resId,
    { $push: { favorite: { _id } } },
    { new: true }
  );
  if (!updatedReciepe) return HttpError(404, "recipes not found");
  return res.status(200).json(updatedReciepe);
};

const deleteRecipeFromFavorite = async (req, res) => {
  const { _id } = req.user;
  const { id: resId } = req.body;
  const deletedFromFavorite = await Recipe.findByIdAndUpdate(
    resId,
    { $pull: { favorite: { _id: _id } } },
    { new: true }
  );
  if (!deletedFromFavorite) throw HttpError(404, "recipes not found");
  res.status(200).json("succses");
  // const deletedFromFavorite = await Recipe.findOneAndDelete({ _id: resId, favorite: _id });
  //  if (deletedFromFavorite === null) throw HttpError(404, 'not found');
  // res.status(200).json({ message: 'recipe is deleted from favorite' });
};

const getPouplarRecipes = async (req, res) => {
  const recipes = await Recipe.find();
  if (!recipes) throw HttpError(404, "recipes not found");
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
  const { id, measure } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { shoppingList: { _id: id, measure } } },
    { new: true }
  );
  if (!updatedUser) throw HttpError(404, "not found");
  return res.status(200).json(updatedUser.shoppingList);
};

const removeProductFromSoppingList = async (req, res) => {
  const { _id: userId } = req.user;
  const { id } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { shoppingList: { _id: id } } },
    { new: true }
  );
  if (!updatedUser) throw HttpError(404, "not found");
  return res.status(200).json(updatedUser.shoppingList);
};
const getShoppingList = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("shoppingList");
  if (!user) return HttpError(404, "not found");
  const list = user.shoppingList;
  res.status(200).json(list);
};
const getUserInfo = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("shoppingList");
  if (!user) throw HttpError(404, "not found");
  const userRecipes = await Recipe.find({
    favorite: { $elemMatch: { _id } },
  }).populate("favorite");
  if (!userRecipes) throw HttpError(404, "not found");
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
