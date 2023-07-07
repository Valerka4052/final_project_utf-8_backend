const { validateBody } = require("../middlewares");

const { schemas } = require("../models/user");
const ctrl = require("../controllers/auth");
const express = require("express");
const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody.validateBodyPost(schemas.registerSchema),
  ctrl.register
);

module.exports = authRouter;
