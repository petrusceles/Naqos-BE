const express = require("express");
const routes = express.Router();
const ReviewControllers = require("../controllers/review.controllers.js");

const authMiddlerwares = require("../middlewares/auth.js");

routes.post(
  "/",
  authMiddlerwares.checkAuthenticated,
  authMiddlerwares.isBuyer,
  ReviewControllers.createReview
);

routes.get("/", ReviewControllers.findAllReviews);
routes.get("/:id", ReviewControllers.findReviewById);
routes.put(
  "/:id",
  authMiddlerwares.checkAuthenticated,
  authMiddlerwares.isBuyer,
  ReviewControllers.updateReviewById
);
routes.delete(
  "/:id",
  authMiddlerwares.checkAuthenticated,
  authMiddlerwares.isBuyer,
  ReviewControllers.deleteReviewById
);

module.exports = routes;
