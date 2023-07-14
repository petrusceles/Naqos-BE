const ReviewRepositories = require("../repositories/review.repositories.js");
const BookingRepositories = require("../repositories/booking.repositories.js");
const createReviewService = async ({ user_id, booking_id, star, review }) => {
  try {
    const booking = await BookingRepositories.findBookingByIdRepo({
      id: booking_id,
    });

    if (booking.phase != "confirmation") {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "cannot review undone transaction",
        data: {
          review: null,
        },
      };
    }

    if (user_id != booking.buyer.id) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: "only buyer can review",
      };
    }

    const reviewData = await ReviewRepositories.createReviewRepo({
      booking,
      star,
      review,
    });
    return {
      status: "SUCCESS",
      statusCode: 201,
      message: "review created",
      data: {
        review: reviewData,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        review: null,
      },
    };
  }
};

const findAllReviewsService = async () => {
  try {
    const reviews = await ReviewRepositories.findAllReviewsRepo();
    if (!reviews.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "reviews is empty",
        reviews: null,
      };
    }
    return reviews;
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        review: null,
      },
    };
  }
};

const findReviewByIdService = async ({ id }) => {
  try {
    const reviews = await ReviewRepositories.findReviewByIdRepo({ id });
    if (!reviews) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "review not found",
        reviews: null,
      };
    }
    return reviews;
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        review: null,
      },
    };
  }
};

const updateReviewByIdService = async ({
  user_id,
  id,
  booking_id,
  phase,
  star,
  review,
}) => {
  try {
    const reviewData = await ReviewRepositories.findReviewByIdRepo({ id });
    if (!reviewData) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "review not found",
        updated_review: null,
      };
    }

    if (user_id != reviewData.booking.buyer._id) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: "user cannot review",
        updated_review: null,
      };
    }

    let booking;
    if (booking_id) {
      booking = await BookingRepositories.findBookingByIdRepo({
        id: booking_id,
      });
      if (!booking) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "invalid booking id",
          updated_review: null,
        };
      }

      if (booking.phase != "confirmation") {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "cannot review undone transaction",
          data: {
            updated_review: null,
          },
        };
      }
    }

    const updatedReview = await ReviewRepositories.updateReviewByIdRepo({
      id,
      booking,
      phase,
      star,
      review,
    });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "review updated",
      updated_review: updatedReview,
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        updated_review: null,
      },
    };
  }
};

const deleteReviewService = async ({ id }) => {
  try {
    const reviewData = await ReviewRepositories.findReviewByIdRepo({ id });
    if (!reviewData) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "review not found",
        deleted_review: null,
      };
    }
    const deletedReview = await ReviewRepositories.deleteReviewByIdRepo({ id });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "review deleted",
      deleted_review: deletedReview,
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        deleted_review: null,
      },
    };
  }
};

module.exports = {
  createReviewService,
  findAllReviewsService,
  findReviewByIdService,
  updateReviewByIdService,
  deleteReviewService,
};
