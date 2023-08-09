const passport = require("../config/passport.local.config.js");
const express = require("express");
const routes = express.Router();
const authMiddlewares = require("../middlewares/auth.js");
const AuthControllers = require("../controllers/auth.controllers.js");
routes.post(
  "/login",
  authMiddlewares.checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/api/auth/login/success",
    failureRedirect: "/api/auth/login/failed",
    failureMessage: true,
    successMessage: true,
  })
);

routes.get("/me", authMiddlewares.checkAuthenticated, AuthControllers.me)

routes.get("/login/success", AuthControllers.loginSuccess);
routes.get("/login/failed", AuthControllers.loginFailed);
routes.delete("/logout", AuthControllers.logout);
module.exports = routes;
