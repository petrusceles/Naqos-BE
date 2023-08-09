const ReviewRepositories = require("../repositories/review.repositories.js");
const BookingRepositories = require("../repositories/booking.repositories.js");
const KostRepositories = require("../repositories/kost.repositories.js");
const createReviewService = async ({ user_id, kost_id, star, review }) => {
  try {
    let booking = await BookingRepositories.findAllBookingsRepo({
      query: {
        kost: kost_id,
        user: user_id,
      },
    });
    if (!booking.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "cannot review unbooked kost",
        data: {
          review: null,
        },
      };
    }

    booking = booking[0];

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

    if (user_id != booking.user.id) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: "only buyer can review",
      };
    }

    const reviewData = await ReviewRepositories.createReviewRepo({
      user_id,
      kost_id,
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

const findAllReviewsService = async ({ query }) => {
  try {
    const reviews = await ReviewRepositories.findAllReviewsRepo({ query });
    if (!reviews.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "reviews is empty",
        data: null,
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "reviews retrieved",
      data: reviews,
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

const findReviewByIdService = async ({ id }) => {
  try {
    const review = await ReviewRepositories.findReviewByIdRepo({ id });
    if (!review) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "review not found",
        data: null,
      };
    }
    return {
      status: "FOUND",
      statusCode: 400,
      message: "review retrieved",
      data: review,
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

const updateReviewByIdService = async ({
  user_id,
  id,
  kost_id,
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

    if (user_id != reviewData.user._id) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: "user cannot update review",
        updated_review: null,
      };
    }

    let user, kost;
    if (user_id && kost_id) {
      let booking = await BookingRepositories.findAllBookingsRepo({
        query: {
          user: user_id,
          kost: kost_id,
        },
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
      user = user_id;
      kost = kost_id;
    }

    const updatedReview = await ReviewRepositories.updateReviewByIdRepo({
      id,
      user,
      kost,
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

const deleteReviewService = async ({ id, user_id }) => {
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

    if (reviewData.user != user_id) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: "user cannot delete this review",
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
