const { validateBody, authenticate } = require("../middlewares");

const { schemas } = require("../models/user");
const ctrl = require("../controllers/auth");
const express = require("express");
const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody.validateBodyPost(schemas.registerSchema),
  ctrl.register
);

authRouter.post(
  "/login",
  validateBody.validateBodyPost(schemas.loginSchema),
  ctrl.login
);

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

module.exports = authRouter;
