const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    subscribeEmail: {
      type: String,
      match: emailRegexp,
    },

    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    shoppingList: {
      type: [
        {
          id: { type: String, ref: "Ingredient" },
          measure: String,
          recipeId: String,
          uniqId: String,
        },
      ],

      default: [],
    },
    avatarURL: { type: String, default: null },

    // verify: {
    //   type: Boolean,
    //   default: false,
    // },
    // verificationCode: {
    //   type: String,
    //   required: [true, "Verify token is required"],
    // },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const shoppingListSchema = Joi.object({
  ingredientId: Joi.string().required(),
  measure: Joi.string().required(),
  recipeId: Joi.string().required(),
  uniqId: Joi.string().required(),
});

const registerSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "The name must be a string.",
    "any.required": "The name field is required.",
    "string.empty": "The name must not be empty",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "The password must be a string.",
    "any.required": "The password field is required.",
    "string.empty": "The password must not be empty",
    "string.min": "The password must be not less 6 symbols.",
  }),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "The password must be a string.",
    "any.required": "The password field is required.",
    "string.empty": "The password must not be empty",
    "string.min": "The password must be not less 6 symbols.",
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
  refreshSchema,
  shoppingListSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
