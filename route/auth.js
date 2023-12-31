const {
  validateBody,
  authenticate,
  upload,
  passport,
} = require("../middlewares");

const { schemas } = require("../models/user");
const ctrl = require("../controllers/auth");
const express = require("express");
const authRouter = express.Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  ctrl.googleAuth
);

authRouter.post(
  "/register",
  validateBody.validateBodyPost(schemas.registerSchema),
  ctrl.register
);

authRouter.get("/verify/:verificationCode", ctrl.verifyEmail);

authRouter.post(
  "/verify",
  validateBody.validateBodyPost(schemas.emailSchema),
  ctrl.resendVerifyEmail
);

authRouter.post(
  "/login",
  validateBody.validateBodyPost(schemas.loginSchema),
  ctrl.login
);
authRouter.post(
  "/refresh",
  validateBody.validateBodyPost(schemas.refreshSchema),
  ctrl.refresh
);

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.patch(
  "/update",
  authenticate,
  upload.single("avatar"),
  ctrl.updateUser
);

module.exports = authRouter;
