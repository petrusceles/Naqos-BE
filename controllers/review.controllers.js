const ReviewServices = require("../services/review.services.js");

const createReview = async (req, res) => {
  const user_id = req.session.passport.user._id;
  const { kost_id, star, review } = req.body;
  const { status, statusCode, message, data } =
    await ReviewServices.createReviewService({
      user_id,
      kost_id,
      star,
      review,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllReviews = async (req, res) => {
  const query = req.query;
  console.log(query)
  const { status, statusCode, message, data } =
    await ReviewServices.findAllReviewsService({ query });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findReviewById = async (req, res) => {
  const { id } = req.params;
  const { status, statusCode, message, data } =
    await ReviewServices.findReviewByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateReviewById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.session.passport.user._id;
  const { kost_id, star, review } = req.body;
  const { status, statusCode, message, data } =
    await ReviewServices.updateReviewByIdService({
      user_id,
      id,
      kost_id,
      star,
      review,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const deleteReviewById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.session.passport.user._id;
  const { status, statusCode, message, data } =
    await ReviewServices.deleteReviewService({ id, user_id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createReview,
  findAllReviews,
  findReviewById,
  updateReviewById,
  deleteReviewById,
};
