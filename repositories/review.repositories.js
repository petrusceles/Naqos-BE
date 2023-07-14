const Review = require("../models/review.model.js");

const opts = {
  runValidators: true,
};

const createReviewRepo = async ({ booking, star, review }) => {
  const reviewData = await Review.create({
    booking,
    star,
    review,
  });
  return reviewData;
};

const findAllReviewsRepo = async () => {
  const reviews = await Review.find().populate({
    path: "booking",
    populate: {
      path: "buyer",
      select: "-password",
    },
  });;
  return reviews;
};

const findReviewByIdRepo = async ({ id }) => {
  const review = await Review.findById(id).populate({
    path: "booking",
    populate: {
        path:"buyer",
        select: "-password"
    }
  });
  return review;
};

const updateReviewByIdRepo = async ({ id, booking, star, review }) => {
  const updatedReview = await Review.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        booking,
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
