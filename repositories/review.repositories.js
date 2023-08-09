const Review = require("../models/review.model.js");

const opts = {
  runValidators: true,
};

const createReviewRepo = async ({ user_id, kost_id, star, review }) => {
  const reviewData = await Review.create({
    kost: kost_id,
    user: user_id,
    star,
    review,
  });
  return reviewData;
};

const findAllReviewsRepo = async ({ query }) => {
  const reviews = await Review.find(query)
    .populate({
      path: "kost",
      populate: {
        path: "user",
        select: "-password",
      },
    })
    .populate({
      path: "user",
      select: "-password",
    });
  return reviews;
};

const findReviewByIdRepo = async ({ id }) => {
  const review = await Review.findById(id).populate({
    path: "kost",
    populate: {
      path: "user",
      select: "-password",
    },
  });
  return review;
};

const updateReviewByIdRepo = async ({ id, kost, user, star, review }) => {
  const updatedReview = await Review.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        user,
        kost,
        star,
        review,
      },
    },
    opts
  );
  return updatedReview;
};

const deleteReviewByIdRepo = async ({ id }) => {
  const deletedReview = await Review.deleteOne({ _id: id });
  return deletedReview;
};

module.exports = {
  createReviewRepo,
  findAllReviewsRepo,
  findReviewByIdRepo,
  updateReviewByIdRepo,
  deleteReviewByIdRepo,
};
