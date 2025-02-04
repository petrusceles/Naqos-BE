const BookingRepositories = require("../repositories/booking.repositories.js");
const UserRepositories = require("../repositories/user.repositories.js");
const KostRepositories = require("../repositories/kost.repositories.js");
const CloudinaryUtils = require("../utils/cloudinary.utils.js");
const phaseOrder = ["booking", "payment", "confirmation"];

const createBookingService = async ({
  user_id,
  kost_id,
  in_date,
  out_date,
  time,
  price,
}) => {
  try {
    if (!user_id || !kost_id || !in_date || !out_date || !time || !price) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `all fields should be assigned`,
        data: {
          created_booking: null,
        },
      };
    }

    const user = await UserRepositories.findUserByIdRepo({ id: user_id });

    if (!user) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `user with id ${user_id} doesn't exist`,
        data: {
          created_booking: null,
        },
      };
    }

    const kost = await KostRepositories.findKostByIdRepo({ id: kost_id });

    if (!kost) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost with id ${kost_id} doesn't exist`,
        data: {
          created_booking: null,
        },
      };
    }

    const inDateFormated = new Date(in_date);

    if (isNaN(inDateFormated)) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `invalid in date format`,
        data: {
          created_booking: null,
        },
      };
    }

    const outDateFormated = new Date(out_date);

    if (isNaN(outDateFormated)) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `invalid out date format`,
        data: {
          created_booking: null,
        },
      };
    }

    const createdBooking = await BookingRepositories.createBookingRepo({
      user,
      kost,
      phase: "booking",
      in_date: inDateFormated,
      out_date: outDateFormated,
      price,
      time,
    });

    return {
      status: "SUCCESS",
      statusCode: 201,
      message: "booking created",
      data: {
        created_booking: createdBooking,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        created_booking: null,
      },
    };
  }
};

const findAllBookingsService = async ({
  limit,
  sorted_by,
  search_by,
  sort,
  skip,
}) => {
  try {
    let query = {
      $and: [],
    };
    if (search_by) {
      query = Object.assign(query, search_by);
    }

    for (const key in query) {
      if (Object.hasOwnProperty.call(query, key)) {
        switch (key) {
          case "phase":
            query["$and"] = [...query?.$and, { phase: { $in: query?.phase } }];
            delete query?.phase;
            break;
          case "user":
            query["$and"] = [...query?.$and, { user: { $in: query?.user } }];
            delete query?.user;
            break;
          default:
            break;
        }
      }
    }
    if (!query.$and.length) {
      delete query.$and;
    }

    const bookings = await BookingRepositories.findAllBookingsRepo({
      query,
      skip,
      limit,
      sorted_by,
      sort,
    });
    if (!bookings?.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "bookings is empty",
        data: {
          bookings: null,
        },
      };
    }

    const bookingTotal = await BookingRepositories.findAllBookingsCountRepo({
      query,
    });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "bookings retrieved",
      data: {
        bookings: bookings,
        next_skip: parseInt(skip) + parseInt(limit),
        next_limit: bookingTotal,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        bookings: null,
      },
    };
  }
};

const findBookingByIdService = async ({ id }) => {
  try {
    const booking = await BookingRepositories.findBookingByIdRepo({ id });
    if (!booking) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `booking with id ${id} not found`,
        data: {
          booking: null,
        },
      };
    }
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `booking retrieved`,
      data: {
        booking: booking,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        booking: null,
      },
    };
  }
};

const updateBookingByIdService = async ({
  id,
  user_id,
  phase,
  proof_photo,
  in_date,
  out_date,
  price,
  time,
}) => {
  try {
    let booking = await BookingRepositories.findBookingByIdRepo({ id });
    if (!booking) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `booking with id ${id} doesn't exist`,
        data: {
          updated_booking: null,
        },
      };
    }

    // let buyer;
    // if (buyer_id) {
    //   buyer = await UserRepositories.findUserByIdRepo({ id: buyer_id });
    //   if (!buyer) {
    //     return {
    //       status: "NOT_FOUND",
    //       statusCode: 404,
    //       message: `user with id ${buyer_id} doesn't exist`,
    //       data: {
    //         updated_booking: null,
    //       },
    //     };
    //   }
    // }

    // let kost;
    // if (kost_id) {
    //   kost = await KostRepositories.findKostByIdRepo({ id: kost_id });
    //   if (!kost) {
    //     return {
    //       status: "NOT_FOUND",
    //       statusCode: 404,
    //       message: `kost with id ${kost_id} doesn't exist`,
    //       data: {
    //         updated_booking: null,
    //       },
    //     };
    //   }
    // }

    if (phase) {
      if (user_id != booking.user._id && user_id != booking.kost.user._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to modify this data`,
          data: {
            updated_booking: null,
          },
        };
      }

      if (
        phase != phaseOrder[phaseOrder.indexOf(booking.phase) + 1] &&
        phase != "failed"
      ) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `cannot modify phase data by ignoring the phase order`,
          data: {
            updated_booking: null,
          },
        };
      }

      if (phase == "failed") {
        if (
          !(
            (booking.phase == "booking" && user_id == booking.user._id) ||
            (booking.phase == "payment" && user_id == booking.kost.user._id)
          )
        ) {
          return {
            status: "BAD_REQUEST",
            statusCode: 400,
            message: `cannot modify phase to failed after ${booking.phase} or user is not authorized`,
            data: {
              updated_booking: null,
            },
          };
        }
      }

      if (phase == "payment" && user_id != booking.user._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to modify this data`,
          data: {
            updated_booking: null,
          },
        };
      }

      if (phase == "confirmation" && user_id != booking.kost.user._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }

      if (!phase) {
        return {
          status: "NOT_FOUND",
          statusCode: 404,
          message: `phase with id ${phase_id} doesn't exist`,
          data: {
            updated_booking: null,
          },
        };
      }
    }

    let inDateFormated;
    if (in_date) {
      if (user_id != booking.user._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }
      inDateFormated = new Date(in_date);
      if (isNaN(inDateFormated)) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `invalid in date format`,
          data: {
            updated_booking: null,
          },
        };
      }
    }

    let outDateFormated;
    if (out_date) {
      if (user_id != booking.user._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }
      outDateFormated = new Date(out_date);
      if (isNaN(outDateFormated)) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `invalid out date format`,
          data: {
            updated_booking: null,
          },
        };
      }
    }

    let proofPhotoUrl;
    if (proof_photo) {
      if (user_id != booking.user._id) {
        return {
          status: "UNAUTHORIZED",
          statusCode: 401,
          message: `user not allowed to mopdify this data`,
          data: {
            updated_booking: null,
          },
        };
      }
      const oldProofPhotoUrl = booking?.proof_photo_url;
      const proofPhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        proof_photo,
        "ProofPhoto"
      );
      proofPhotoUrl = proofPhotoResponse.secure_url;
      if (oldProofPhotoUrl) {
        const oldProofPhotoPublicId =
          CloudinaryUtils.getPublicIdFromCloudinaryUrl(oldProofPhotoUrl);
        CloudinaryUtils.deleteAllImages([oldProofPhotoPublicId]);
      }
    }

    const updatedBooking = await BookingRepositories.updateBookingByIdRepo({
      id,
      phase,
      proof_photo_url: proofPhotoUrl,
      in_date: inDateFormated,
      out_date: outDateFormated,
      time,
      price,
    });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `booking updated`,
      data: {
        updated_booking: updatedBooking,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        updated_booking: null,
      },
    };
  }
};

const deleteBookingById = async ({ id, user_id }) => {
  try {
    const booking = await BookingRepositories.findBookingByIdRepo({ id });

    if (user_id != booking.user._id && user_id != booking.kost.user._id) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: `user not allowed to modify this data`,
        data: {
          deleted_booking: null,
        },
      };
    }

    if (!booking) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `booking with id ${id} doesn't exist`,
        data: {
          deleted_booking: null,
        },
      };
    }
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `booking with id ${id} deleted`,
      data: {
        deleted_booking: null,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        deleted_booking: null,
      },
    };
  }
};

module.exports = {
  createBookingService,
  findAllBookingsService,
  findBookingByIdService,
  updateBookingByIdService,
  deleteBookingById,
};
